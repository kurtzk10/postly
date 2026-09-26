// =============================================================================
// streaks.js: works out the streak numbers from a list of postcard dates.
// Written by: me (kurtzk10). Hints by the AI; the code is mine.
// =============================================================================
//
//
// Input example:   dates = ['2026-09-18', '2026-09-19', '2026-09-21']
//                  today = '2026-09-21'
// Output example:  { currentStreak: 1, longestStreak: 2 }
//

function toDayNumber(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    const ms = Date.UTC(year, month-1, day);

    return ms / (24 * 60 * 60 * 1000);
}

export function calculateStreaks(dates, today) {
    const days = dates.map(toDayNumber);

    let longestStreak = 0;
    let run = 1;

    for (let i = 0; i < days.length; i++) {
        if (i > 0 && days[i] === days[i - 1] + 1) {
            run = run + 1;
        } else {
            run = 1;
        }

        longestStreak = Math.max(longestStreak, run);
    }

    const daySet = new Set(days);

    const todayNumber = toDayNumber(today);
    const yesterdayNumber = todayNumber - 1;

    let checkDay;

    if (daySet.has(todayNumber)) {
        checkDay = todayNumber;
    } else {
        checkDay = yesterdayNumber;
    }

    let currentStreak = 0;

    while (daySet.has(checkDay)) {
        currentStreak = currentStreak + 1;
        checkDay = checkDay - 1;
    }

    return {currentStreak, longestStreak};
}