const myBot = new (function()
{
    return {
        initialized: false,
        config: {
            action: {
                range: { min: 0, max: 6 },
                list: {
                     0: { parent: 'normal',    el: 'hunt',      name: '狩獵兔肉'  },
                     1: { parent: 'normal',    el: 'train',     name: '自主訓練'  },
                     2: { parent: 'normal',    el: 'picnic',    name: '外出野餐'  },
                     3: { parent: 'normal',    el: 'flirt',     name: '汁妹'      },
                     4: { parent: 'normal',    el: 'good',      name: '做善事'    },
                     5: { parent: 'normal',    el: 'sit',       name: '坐下休息'  },
                     6: { parent: 'normal',    el: 'fish',      name: '釣魚'      },
                     7: { parent: 'cultivate', el: 'oneHour',   name: '修行1小時' },
                     8: { parent: 'cultivate', el: 'twoHour',   name: '修行2小時' },
                     9: { parent: 'cultivate', el: 'fourHour',  name: '修行4小時' },
                    10: { parent: 'cultivate', el: 'eightHour', name: '修行8小時' }
                }
            },

        },
        data: {
            bonus:  { cdTime: null },
            action: { cdTime: 0 }
        },
        el: {
            navbar: {
                nav: null,
                a: {
                    myKirito:           null,
                    userList:           null,
                    boss:               null,
                    achievements:       null,
                    achievementRanking: null,
                    hallOfFame:         null,
                    reincarnation:      null,
                    reports:            null
                }
            },
            general: {
                div: null
            },
            bonus: {
                div:    null,
                cdDiv:  null,
                button: null
            },
            action: {
                div:   null,
                cdDiv: null,
                button: {
                    normal: {
                        hunt:   null,
                        train:  null,
                        picnic: null,
                        flirt:  null,
                        good:   null,
                        sit:    null,
                        fish:   null
                    },
                    cultivate: {
                        oneHour:   null,
                        twoHour:   null,
                        fourHour:  null,
                        eightHour: null
                    }
                }
            }
        },
        checkInterval: {
            id: null,
            min: 69000,
            max: 98999
        },
        timeBetweenActionAndGettingBonus: 1000,
        consoleLogStyle: {
            check:  'color: goldenrod;      font-family: Arial, MingLiU; font-weight: bold;',
            gohome: 'color: darkgoldenrod;  font-family: Arial, MingLiU;',
            action: 'color: forestgreen;    font-family: Arial, MingLiU;',
            bonus:  'color: cornflowerblue; font-family: Arial, MingLiU;',
            other:  'color: indianred;      font-family: Arial, MingLiU;'
        },
        init()
        {
            console.log(`%c[${this.dateFormat(new Date(), true)}] 初始化`, this.consoleLogStyle.check);

            const me = this;

            this.locate();

            const actionCoolDownTime = this.getActionCoolDownTime();
            if (actionCoolDownTime <= 0 && this.isActable())
            {
                this.act();
            }

            /* 行動與領取樓層獎勵之間保持一定時間間隔 */
            setTimeout(function()
            {
                const bonusCoolDownTime = me.getBonusCoolDownTime();
                if (bonusCoolDownTime !== null && bonusCoolDownTime <= 0 && me.isLevelBonusGettable())
                {
                    me.getLevelBonus();
                }
            }, this.timeBetweenActionAndGettingBonus);

            /* 設定下次執行間隔 */
            const min = this.checkInterval.min;
            const max = this.checkInterval.max + 1;
            const randomDelayTime = Math.floor(Math.random() * (max - min) + min);
            this.checkInterval.id = setTimeout(function()
            {
                console.log(`%c[${me.dateFormat(new Date(), true)}] 距離上次執行間隔：${randomDelayTime} 毫秒`, me.consoleLogStyle.other);
                me.check();
            }, randomDelayTime);
        },
        locate()
        {
            const me = this;

            const navbar = this.el.navbar.nav = document.querySelector('nav');
            const navAs = navbar.querySelectorAll('a')
            for (let i = 0; i < navAs.length; i++)
            {
                const el = navAs[i];
        
                if (el.textContent.match(/我的桐人/))
                {
                    this.el.navbar.a.myKirito = el;
                }
                else if (el.textContent.match(/玩家列表/))
                {
                    this.el.navbar.a.userList = el;
                }
                else if (el.textContent.match(/Boss/))
                {
                    this.el.navbar.a.boss = el;
                }
                else if (el.textContent.match(/成就/) && !el.textContent.match(/榜/))
                {
                    this.el.navbar.a.achievements = el;
                }
                else if (el.textContent.match(/成就榜/))
                {
                    this.el.navbar.a.achievementRanking = el;
                }
                else if (el.textContent.match(/名人堂/))
                {
                    this.el.navbar.a.hallOfFame = el;
                }
                else if (el.textContent.match(/轉生/))
                {
                    this.el.navbar.a.reincarnation = el;
                }
                else if (el.textContent.match(/戰報/))
                {
                    this.el.navbar.a.reports = el;
                }
            }
        
            const heads = document.querySelectorAll('h3');
            for (let i = 0; i < heads.length; i++)
            {
                const el = heads[i];
        
                if (el.textContent.match(/我的桐人/))
                {
                    this.el.general.div = el.parentElement;

                    if (!this.initialized)
                    {
                        this.initialized = true;
                    }
                }
                else if (el.textContent.match(/樓層獎勵/))
                {
                    this.el.bonus.div = el.parentElement;
        
                    this.el.bonus.button = this.el.bonus.div.querySelector('button');
            
                    const localDivs = this.el.bonus.div.querySelectorAll('div');
                    for (let j = 0; j < localDivs.length; j++)
                    {
                        const localDiv = localDivs[j];
            
                        if (localDiv.textContent.match(/冷卻倒數：\d+/))
                        {
                            this.el.bonus.cdDiv = localDiv;
                            this.getBonusCoolDownTime();
                        }
                    }
                }
                else if (el.textContent.match(/行動/) && !el.textContent.match(/記錄/))
                {
                    this.el.action.div = el.parentElement;
        
                    const localButtons = this.el.action.div.querySelectorAll('button');
                    for (let j = 0; j < localButtons.length; j++)
                    {
                        const localButton = localButtons[j];

                        const actionCount = Object.keys(this.config.action.list).length;
                        for (let k = 0; k < actionCount; k++)
                        {
                            const actionName = this.config.action.list[k].name;
                            const actionNode = this.config.action.list[k].el;
                            const actionParentNode = this.config.action.list[k].parent;

                            const re = new RegExp(this.config.action.list[k].name);

                            if (localButton.textContent.match(re))
                            {
                                this.el.action.button[actionParentNode][actionNode] = localButton;
                            }
                        }
                    }
        
                    const localDivs = this.el.action.div.querySelectorAll('div');
                    for (let j = 0; j < localDivs.length; j++)
                    {
                        const localDiv = localDivs[j];
            
                        if (localDiv.textContent.match(/冷卻倒數：\d+/))
                        {
                            this.el.action.cdDiv = localDiv;
                            this.getActionCoolDownTime();
                        }
                    }
                }
            }
        },
        check()
        {
            console.log(`%c[${this.dateFormat(new Date(), true)}] 再次檢查可否行動及領取樓層獎勵`, this.consoleLogStyle.check);

            const me = this;

            if (!this.isInPageMyKirito() || !this.initialized)
            {
                if (this.initialized)
                {
                    this.el.navbar.a.myKirito.click();
                    console.log(`%c[${this.dateFormat(new Date(), true)}] 返回我的桐人主頁`, this.consoleLogStyle.gohome);
                }

                this.locate();
            }

            const actionCoolDownTime = this.getActionCoolDownTime();
            if (actionCoolDownTime <= 0 && this.isActable())
            {
                this.act();
            }

            /* 行動與領取樓層獎勵之間保持一定時間間隔 */
            setTimeout(function()
            {
                const bonusCoolDownTime = me.getBonusCoolDownTime();
                if (bonusCoolDownTime !== null && bonusCoolDownTime <= 0 && me.isLevelBonusGettable())
                {
                    me.getLevelBonus();
                }
            }, this.timeBetweenActionAndGettingBonus);

            /* 設定下次執行間隔 */
            const min = this.checkInterval.min;
            const max = this.checkInterval.max + 1;
            const randomDelayTime = Math.floor(Math.random() * (max - min) + min);
            this.checkInterval.id = setTimeout(function()
            {
                console.log(`%c[${me.dateFormat(new Date(), true)}] 距離上次執行間隔：${randomDelayTime} 毫秒`, me.consoleLogStyle.other);
                me.check();
            }, randomDelayTime);
        },
        act()
        {
            const min = this.config.action.range.min;
            const max = this.config.action.range.max + 1;
            const actionSerial = Math.floor(Math.random() * (max - min) + min);    // 0 ~ 6
            const action = this.config.action.list[actionSerial].el;
            const actionButton = this.el.action.button.normal[action];
            const actionName = this.config.action.list[actionSerial].name;
            console.log(`%c[${this.dateFormat(new Date(), true)}] 行動：${actionName}`, this.consoleLogStyle.action);
            actionButton.click();
        },
        getLevelBonus()
        {
            const button = this.el.bonus.button;
            button.click();
            console.log(`%c[${this.dateFormat(new Date(), true)}] 領取樓層獎勵`, this.consoleLogStyle.bonus);
        },
        getBonusCoolDownTime()
        {
            if (this.el.bonus.cdDiv !== null && document.body.contains(this.el.bonus.cdDiv))
            {
                const matches = this.el.bonus.cdDiv.textContent.match(/冷卻倒數：(\d+)/);
                if (matches !== null && matches.length > 1)
                {
                    this.data.bonus.cdTime = Number(matches[1]);
                }
                else
                {
                    this.data.bonus.cdTime = 0;
                }
            }
            else if (this.isAboveLevelOne() && !document.body.contains(this.el.bonus.cdDiv))
            {
                this.data.bonus.cdTime = 0;
            }
            else if (this.isInPageMyKirito() && !document.body.contains(this.el.bonus.div))
            {
                this.data.bonus.cdTime = null;
            }

            return this.data.bonus.cdTime;
        },
        getActionCoolDownTime()
        {
            if (this.el.action.cdDiv !== null && document.body.contains(this.el.action.cdDiv))
            {
                const matches = this.el.action.cdDiv.textContent.match(/冷卻倒數：(\d+)/);
                if (matches.length > 1)
                {
                    this.data.action.cdTime = Number(matches[1]);
                }
            }
            else if (this.isInPageMyKirito() && !document.body.contains(this.el.action.cdDiv))
            {
                this.data.action.cdTime = 0;
            }

            return this.data.action.cdTime;
        },
        isInPageMyKirito()
        {
            return this.el.general.div !== null && document.body.contains(this.el.general.div);
        },
        isAboveLevelOne()
        {
            return this.el.bonus.div !== null && document.body.contains(this.el.bonus.div);
        },
        isActable()
        {
            const button = this.el.action.button.normal.hunt;
            return document.body.contains(button) && !button.disabled;
        },
        isLevelBonusGettable()
        {
            const button = this.el.bonus.button;
            return document.body.contains(button) && !button.disabled;
        },
        setActionRange(min = 0, max = 6)
        {
            if (max >= min && min >= 0 && max <= 6)
            {
                this.config.action.range.min = min;
                this.config.action.range.max = max;
            }
            else
            {
                console.warn('指定範圍無效！');
            }
        },
        dateFormat(time = new Date(), ms = false)
        {
            let date = new Date(time),
            y = date.getFullYear(),
            m = this.padding(date.getMonth() + 1, '0', 2),
            d = this.padding(date.getDate(), '0', 2),
            h = this.padding(date.getHours(), '0', 2),
            i = this.padding(date.getMinutes(), '0', 2),
            s = this.padding(date.getSeconds(), '0', 2);

            if (!ms)
            {
                return y + '-' + m + '-' + d + ' ' + h + ':' + i + ':' + s;
            }
            else
            {
                let u = this.padding(date.getMilliseconds(), '0', 3);
                return y + '-' + m + '-' + d + ' ' + h + ':' + i + ':' + s + '.' + u;
            }
        },
        padding(str, char, num, direction = 'left')
        {
            let dir = direction.toLowerCase(),
                i = 0,
                dif = 0,
                tar = '',
                len = str.toString().length;
        
            if (len < num)
            {
                dif = num - len;
                for (i = 0; i < dif; i++)
                {
                    tar += char;
                }
                switch (dir)
                {
                    default:
                    case 'left':
                    case 'front':
                    case 'before':
                    case 'default':
                        tar += str.toString();
                        break;
        
                    case 'right':
                    case 'after':
                    case 'back':
                        tar = str.toString() + tar;
                        break;
                }
                return tar;
            }
        
            return str;
        }
    };
})();

myBot.init();
