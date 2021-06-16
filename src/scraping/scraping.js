const puppeteer = require('puppeteer');
const { default: axios } = require('axios');

const tournament = (async () => {

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://www.hltv.org/events/5219/iem-summer-2021');
    const bracketData = await page.evaluate(() => {
        const nodeList = document.querySelectorAll('span.team-name.text-ellipsis');
        const resultList = document.querySelectorAll('div.rounds div.team');
        const prizeNameList = document.querySelectorAll('div.placement div.team');
        const lineupList = document.querySelectorAll('div.standard-box.team-box.supports-hover');
        const groupList = document.querySelectorAll('div.slotted-bracket-header span');
        const rankList = document.querySelectorAll('div.event-world-rank');
        const matchDateList = document.querySelectorAll('div.slots div.slot-wrapper');
        //Transforming List of HTML elements in array
        const groupArray = [...groupList];
        const rankArray = [...rankList];
        const tableArray = [...nodeList];
        const lineupArray = [...lineupList];
        const prizeNameArray = [...prizeNameList];
        const matchDateArray = [...matchDateList];

        const matchDateClass = [];

        matchDateArray.forEach(item => {
            return matchDateClass.push(item.firstElementChild.getAttribute('class'))
        })

        const allData = [];
        const resultsArray = [];
        const resultArray = [];
        const imageArray = [];
        const prizeDistribuition = [];
        const lineupArrayFormatted = [];
        const matchDateArrayFormatted = [];

        //match date Data
        matchDateArray.forEach((item, index) => {
            if (matchDateClass[index] !== 'match') {
                return matchDateArrayFormatted.push({
                    time: item.querySelector('span.bold.time-time').outerText,
                    day: item.querySelector('span.hide-collapsed.time-day-of-week.text-ellipsis').outerText,
                    bo: item.querySelector('span.hide-collapsed.best-of-x').outerText,
                })
            } else return matchDateArrayFormatted.push({
                day: 'played',
            })

        })
        //Teams Info Screen Data
        lineupArray.forEach((item, index) => {
            const player = item.querySelectorAll('.flag-align');
            const name = item.querySelector('div.text').outerText;
            const players =  [];
            player.forEach(player => {
                players.push(player.querySelector('a').outerText);
            })
            return lineupArrayFormatted.push({
                name,
                picname: name.toLowerCase().replace(' ', '-'),
                rank: rankArray[index].outerText,
                players,
            })
        });

        //Prize Distribuition Screen Data
        prizeNameArray.forEach(item => {
            if (!item.firstChild) {
                return prizeDistribuition.push({
                    name: 'not_defined',
                    placement: item.nextSibling.nextSibling.innerHTML,
                    prizeMoney: item.nextSibling.nextSibling.nextSibling.nextSibling.innerHTML,
                });
            }
            else {
                return prizeDistribuition.push({
                    name: item.lastChild.innerHTML,
                    placement: item.nextSibling.nextSibling.innerHTML,
                    prizeMoney: item.nextSibling.nextSibling.nextSibling.nextSibling.innerHTML,
                });
            }
        });


        resultList.forEach(item => {
            if (item.firstElementChild.className.includes('slot-multi')) {
                return imageArray.push('TBD')
            } else return imageArray.push(item.firstElementChild.firstElementChild.src);

        })

        resultList.forEach(item => {
            if (item.className.includes('winner')) {
                resultArray.push('winner');
                return
            } else if (item.className.includes('loser')) {
                resultArray.push('loser');
                return
            } else resultArray.push('not_played');
        });

        nodeList.forEach(item => {
            const exists = item.nextSibling;
            if (exists) {
                if (exists.innerHTML === '') {
                    resultsArray.push(Number(exists.nextSibling.innerHTML));
                } else {
                    resultsArray.push(Number(exists.innerHTML));
                }
            }
            else resultsArray.push(0);
        })

        const teamList = tableArray.map(span => {
            return span.innerHTML;
        });


        //Criando objeto com info do time
        for (i = 0; i < resultArray.length; i++) {
            allData.push({
                name: teamList[i],
                picname: teamList[i].toLowerCase().replace(' ', '-'),
                score: resultsArray[i],
                image: imageArray[i],
                result: resultArray[i],
            })
        }
        let bracket = {}
        if (groupArray[0].outerText === 'Single Elimination Bracket') {
            bracket = {
                playoff: {
                    quarterFinal: [{
                        date: matchDateArrayFormatted[0],
                        firstTeam: allData[0],
                        secondTeam: allData[1]
                    },
                    {
                        date: matchDateArrayFormatted[1],
                        firstTeam: allData[2],
                        secondTeam: allData[3],
                    }
                    ],
                    semiFinal: [{
                        date: matchDateArrayFormatted[2],
                        firstTeam: allData[4],
                        secondTeam: allData[5],
                    },
                    {
                        date: matchDateArrayFormatted[3],
                        firstTeam: allData[6],
                        secondTeam: allData[7],
                    }
                    ],
                    final: [{
                        date: matchDateArrayFormatted[4],
                        firstTeam: allData[8],
                        secondTeam: allData[9]
                    }],
                },
                group_A: {
                    upperBracket: {
                        quarterFinal: [{
                            date: matchDateArrayFormatted[5],
                            firstTeam: allData[10],
                            secondTeam: allData[11]
                        },
                        {
                            date: matchDateArrayFormatted[6],
                            firstTeam: allData[12],
                            secondTeam: allData[13]
                        },
                        {
                            date: matchDateArrayFormatted[7],
                            firstTeam: allData[14],
                            secondTeam: allData[15]
                        },
                        {
                            date: matchDateArrayFormatted[8],
                            firstTeam: allData[16],
                            secondTeam: allData[17]
                        },
                        ],
                        semiFinal: [{
                            date: matchDateArrayFormatted[9],
                            firstTeam: allData[18],
                            secondTeam: allData[19]
                        },
                        {
                            date: matchDateArrayFormatted[10],
                            firstTeam: allData[20],
                            secondTeam: allData[21]
                        },
                        ],
                        final: [{
                            date: matchDateArrayFormatted[11],
                            firstTeam: allData[22],
                            secondTeam: allData[23]
                        }]
                    },
                    lowerBracket: {
                        quarterFinal: [{
                            date: matchDateArrayFormatted[12],
                            firstTeam: allData[24],
                            secondTeam: allData[25]
                        },
                        {
                            date: matchDateArrayFormatted[13],
                            firstTeam: allData[26],
                            secondTeam: allData[27]
                        },
                        ],
                        semiFinal: [{
                            date: matchDateArrayFormatted[14],
                            firstTeam: allData[28],
                            secondTeam: allData[29]
                        },
                        {
                            date: matchDateArrayFormatted[15],
                            firstTeam: allData[30],
                            secondTeam: allData[31]
                        },
                        ],
                        final: [{
                            date: matchDateArrayFormatted[16],
                            firstTeam: allData[32],
                            secondTeam: allData[33]
                        }],
                    }
                },
                group_B: {
                    upperBracket: {
                        quarterFinal: [{
                            date: matchDateArrayFormatted[17],
                            firstTeam: allData[34],
                            secondTeam: allData[35]
                        },
                        {
                            date: matchDateArrayFormatted[18],
                            firstTeam: allData[36],
                            secondTeam: allData[37]
                        },
                        {
                            date: matchDateArrayFormatted[19],
                            firstTeam: allData[38],
                            secondTeam: allData[39]
                        },
                        {
                            date: matchDateArrayFormatted[20],
                            firstTeam: allData[40],
                            secondTeam: allData[41]
                        },
                        ],
                        semiFinal: [{
                            date: matchDateArrayFormatted[21],
                            firstTeam: allData[42],
                            secondTeam: allData[43]
                        },
                        {
                            date: matchDateArrayFormatted[22],
                            firstTeam: allData[44],
                            secondTeam: allData[45]
                        },
                        ],
                        final: [{
                            date: matchDateArrayFormatted[23],
                            firstTeam: allData[46],
                            secondTeam: allData[47]
                        }]
                    },
                    lowerBracket: {
                        quarterFinal: [{
                            date: matchDateArrayFormatted[24],
                            firstTeam: allData[48],
                            secondTeam: allData[49]
                        },
                        {
                            date: matchDateArrayFormatted[25],
                            firstTeam: allData[50],
                            secondTeam: allData[51]
                        }],
                        semiFinal: [{
                            date: matchDateArrayFormatted[26],
                            firstTeam: allData[52],
                            secondTeam: allData[53]
                        },
                        {
                            date: matchDateArrayFormatted[27],
                            firstTeam: allData[54],
                            secondTeam: allData[55]
                        }],
                        final: [{
                            date: matchDateArrayFormatted[28],
                            firstTeam: allData[56],
                            secondTeam: allData[57]
                        }],
                    }
                },
                prize_distribuition: prizeDistribuition,
                teams: lineupArrayFormatted,
            }


        } else {
            bracket = {
                group_A: {
                    upperBracket: {
                        quarterFinal: [{
                            date: matchDateArrayFormatted[0],
                            firstTeam: allData[0],
                            secondTeam: allData[1]
                        },
                        {
                            date: matchDateArrayFormatted[1],
                            firstTeam: allData[2],
                            secondTeam: allData[3]
                        },
                        {
                            date: matchDateArrayFormatted[2],
                            firstTeam: allData[4],
                            secondTeam: allData[5]
                        },
                        {
                            date: matchDateArrayFormatted[3],
                            firstTeam: allData[6],
                            secondTeam: allData[7]
                        },
                        ],
                        semiFinal: [{
                            date: matchDateArrayFormatted[4],
                            firstTeam: allData[8],
                            secondTeam: allData[9]
                        },
                        {
                            date: matchDateArrayFormatted[5],
                            firstTeam: allData[10],
                            secondTeam: allData[11]
                        },
                        ],
                        final: [{
                            date: matchDateArrayFormatted[6],
                            firstTeam: allData[12],
                            secondTeam: allData[13]
                        }]
                    },
                    lowerBracket: {
                        quarterFinal: [{
                            date: matchDateArrayFormatted[7],
                            firstTeam: allData[14],
                            secondTeam: allData[15]
                        },
                        {
                            date: matchDateArrayFormatted[8],
                            firstTeam: allData[16],
                            secondTeam: allData[17]
                        },
                        ],
                        semiFinal: [{
                            date: matchDateArrayFormatted[9],
                            firstTeam: allData[18],
                            secondTeam: allData[19]
                        },
                        {
                            date: matchDateArrayFormatted[10],
                            firstTeam: allData[20],
                            secondTeam: allData[21]
                        },
                        ],
                        final: [{
                            date: matchDateArrayFormatted[11],
                            firstTeam: allData[22],
                            secondTeam: allData[23]
                        }],
                    }
                },
                group_B: {
                    upperBracket: {
                        quarterFinal: [{
                            date: matchDateArrayFormatted[12],
                            firstTeam: allData[24],
                            secondTeam: allData[25]
                        },
                        {
                            date: matchDateArrayFormatted[13],
                            firstTeam: allData[26],
                            secondTeam: allData[27]
                        },
                        {
                            date: matchDateArrayFormatted[14],
                            firstTeam: allData[28],
                            secondTeam: allData[29]
                        },
                        {
                            date: matchDateArrayFormatted[15],
                            firstTeam: allData[30],
                            secondTeam: allData[31]
                        },
                        ],
                        semiFinal: [{
                            date: matchDateArrayFormatted[16],
                            firstTeam: allData[32],
                            secondTeam: allData[33]
                        },
                        {
                            date: matchDateArrayFormatted[17],
                            firstTeam: allData[34],
                            secondTeam: allData[35]
                        },
                        ],
                        final: [{
                            date: matchDateArrayFormatted[18],
                            firstTeam: allData[36],
                            secondTeam: allData[37]
                        }]
                    },
                    lowerBracket: {
                        quarterFinal: [{
                            date: matchDateArrayFormatted[19],
                            firstTeam: allData[38],
                            secondTeam: allData[39]
                        },
                        {
                            date: matchDateArrayFormatted[20],
                            firstTeam: allData[40],
                            secondTeam: allData[41]
                        }],
                        semiFinal: [{
                            date: matchDateArrayFormatted[21],
                            firstTeam: allData[42],
                            secondTeam: allData[43]
                        },
                        {
                            date: matchDateArrayFormatted[22],
                            firstTeam: allData[44],
                            secondTeam: allData[45]
                        }],
                        final: [{
                            date: matchDateArrayFormatted[23],
                            firstTeam: allData[46],
                            secondTeam: allData[47]
                        }],
                    }
                },
                playoff: {
                    quarterFinal: [{
                        date: matchDateArrayFormatted[24],
                        firstTeam: allData[48],
                        secondTeam: allData[49]
                    },
                    {
                        date: matchDateArrayFormatted[25],
                        firstTeam: allData[50],
                        secondTeam: allData[51],
                    }
                    ],
                    semiFinal: [{
                        date: matchDateArrayFormatted[26],
                        firstTeam: allData[52],
                        secondTeam: allData[53],
                    },
                    {
                        date: matchDateArrayFormatted[27],
                        firstTeam: allData[54],
                        secondTeam: allData[55],
                    }
                    ],
                    final: [{
                        date: matchDateArrayFormatted[28],
                        firstTeam: allData[56],
                        secondTeam: allData[57]
                    }],
                },
                prize_distribuition: prizeDistribuition,
                teams: lineupArrayFormatted,
            }
        }

        return bracket;
    })
    console.log(bracketData)
    await axios.post('http://localhost:3333/tournament', bracketData);
    await browser.close();
});

const lojinha = (async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://streamelements.com/gaules/store');
    const storeData = await page.evaluate(() => {

        const nodeList = document.querySelectorAll('md-card.stream-store-list-item');
        const itemArray = [...nodeList];
        const itensArray = [];

        itemArray.forEach(item => {
            const quantity = item.firstElementChild.nextElementSibling.querySelector('p.public.item-quantity-left span') ?
                item.firstElementChild.nextElementSibling.querySelector('p.public.item-quantity-left span').outerText : 'not_limited';
            return itensArray.push({
                picture_URL: item.firstElementChild.firstElementChild.getAttribute('src'),
                name: item.firstElementChild.nextElementSibling.querySelector('h2.item-title').outerText,
                description: item.firstElementChild.nextElementSibling.querySelector('span.clamp-description-text').outerText,
                price: item.firstElementChild.nextElementSibling.querySelector('p.public.item-cost').outerText.substr(16),
                quantity,
            })
        })

        const notRepeatedArray = itensArray.reduce((acc, current) => {
            const x = acc.find(item => item.name === current.name);
            if (!x) {
                return acc.concat([current]);
            } else {
                return acc;
            }
        }, []);
        return notRepeatedArray;
    })

    await axios.post('http://localhost:3333/itenslojinha', { itens: storeData });
    await browser.close();
});

module.exports = {
    lojinha,
    tournament
};
