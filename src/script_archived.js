const heads = document.querySelectorAll('h3');

const myKirito = {
    el: {
        myKirito: {
            div:   null,
            table: null,
            tbody: null
        }
    },
    data: {
        username:     null,
        character:    null,
        title:        null,
        level:        null,
        exp:          null,
        hp:           null,
        attack:       null,
        armor:        null,
        energy:       null,
        agility:      null,
        response:     null,
        skill:        null,
        intelligence: null,
        luck:         null,
        addition: {
            hp:           null,
            attack:       null,
            armor:        null,
            energy:       null,
            agility:      null,
            response:     null,
            skill:        null,
            intelligence: null,
            luck:         null
        }
    }
};

let divSettings = null;

let divLvlBonus = null;
let btnGetLvlBonus = null;

let divTraining = null;
let btnFishing = null;

let divHistory = null;

for (let i = 0; i < heads.length; i++)
{
    let el = heads[i];

    if (el.textContent.match(/我的桐人/))
    {
        myKirito.el.myKirito.div   = el.parentElement;
        myKirito.el.myKirito.table = myKirito.el.myKirito.div.querySelector('table'),
        myKirito.el.myKirito.tbody = myKirito.el.myKirito.table.querySelector('tbody');

        const tbdMyKirito = myKirito.el.myKirito.tbody;

        myKirito.data.username   = tbdMyKirito.children[0].children[1].textContent;
        myKirito.data.character  = tbdMyKirito.children[1].children[1].textContent;
        myKirito.data.title      = tbdMyKirito.children[2].children[1].textContent;
        myKirito.data.level      = Number(tbdMyKirito.children[3].children[1].textContent);
        myKirito.data.experience = Number(tbdMyKirito.children[3].children[3].textContent);

        const digiDataMap = [
            { row: 4,  key: 'hp'           },
            { row: 5,  key: 'attack'       },
            { row: 6,  key: 'armor'        },
            { row: 7,  key: 'energy'       },
            { row: 8,  key: 'agility'      },
            { row: 9,  key: 'response'     },
            { row: 10, key: 'skill'        },
            { row: 11, key: 'intelligence' },
            { row: 12, key: 'luck'         }
        ];

        digiDataMap.forEach(datum =>
        {
            const {row, key} = datum;
            let rawArray = tbdMyKirito.children[row].children[1].textContent.split(' ');
            console.log(rawArray);
            myKirito.data[key] = Number(rawArray[0]);
            if (rawArray.length > 1)
            {
                myKirito.data.addition[key] = Number(rawArray[1].replace(/^\(/, '').replace(/\)$/, ''));
            }
        });
    }
    else if (el.textContent.match(/設定/))
    {
        divSettings = el.parentElement;
    }
    else if (el.textContent.match(/樓層獎勵/))
    {
        divLvlBonus = el.parentElement;

        for (let j = 0; j < divLvlBonus.childElementCount; j++)
        {
            let chdEl = divLvlBonus.children[j];
            if (chdEl.textContent.match(/領取獎勵/))
            {
                btnGetLvlBonus = chdEl;
                break;
            }
        }
    }
    else if (el.textContent.match(/行動/))
    {
        if (el.textContent.match(/記錄/) === null)
        {
            divTraining = el.parentElement;

            for (let j = 0; j < divTraining.childElementCount; j++)
            {
                let chdEl = divTraining.children[j];
                if (chdEl.textContent.match(/釣魚/))
                {
                    btnFishing = chdEl;
                    break;
                }
            }
        }
        else
        {
            divHistory = el.parentElement;
        }
    }
}

let intvGetLvlBonus = setInterval(getLvlBonus, 10000);

/**
 * 檢查「領取獎勵」按鈕是否可點擊
 *
 * @param  {Element}  button  按鈕元素變數
 * @return {string}
 */
function IsButtonClickable(button)
{
    return (button.disabled !== true) ? true : false;
}

/**
 * 點擊「領取獎勵」按鈕以領取樓層獎勵
 */
function getLvlBonus()
{
    // let now = 
    if (IsButtonClickable(btnGetLvlBonus))
    {
        btnGetLvlBonus.click();
        console.log(`%c${now} %c領取樓層獎勵！`, 'color: purple', 'color: gold');
    }
    else
    {
        console.log(`%c${now} %c還不能領取樓層獎勵！`, 'color: purple', 'color: green');
    }
}

/**
 * 格式化時間字串
 *
 * @param  timestamp  時間戳，預設 `null` 時即產生當前時間的格式化字串
 * @return            格式化的時間字串
 */
function formattedDate(timestamp = null)
{
    const now = (timestamp !== null) ? new Date(timestamp) : new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1 < 10) ? `0${now.getMonth() + 1}`: now.getMonth();
    const day = now.getDate();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.get
}
