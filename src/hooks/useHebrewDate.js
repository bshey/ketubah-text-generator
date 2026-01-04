/**
 * Hebrew Date Hook
 * Converts Gregorian dates to Hebrew dates using @hebcal/core
 */

import { useMemo } from 'react'
import { HDate, months, gematriya } from '@hebcal/core'

/**
 * Format Hebrew date in traditional style
 * e.g., "ט״ו בשבט תשפ״ו"
 */
function formatHebrewDate(hdate) {
    const day = gematriya(hdate.getDate())
    const monthName = getHebrewMonthName(hdate.getMonth())
    const year = gematriya(hdate.getFullYear())

    return `${day} ב${monthName} ${year}`
}

/**
 * Get Hebrew month name
 */
function getHebrewMonthName(month) {
    const monthNames = {
        [months.NISAN]: 'ניסן',
        [months.IYYAR]: 'אייר',
        [months.SIVAN]: 'סיון',
        [months.TAMUZ]: 'תמוז',
        [months.AV]: 'אב',
        [months.ELUL]: 'אלול',
        [months.TISHREI]: 'תשרי',
        [months.CHESHVAN]: 'חשון',
        [months.KISLEV]: 'כסלו',
        [months.TEVET]: 'טבת',
        [months.SHVAT]: 'שבט',
        [months.ADAR_I]: 'אדר א׳',
        [months.ADAR_II]: 'אדר ב׳',
    }
    return monthNames[month] || ''
}

/**
 * Format Hebrew date in English
 * e.g., "15 Shevat 5786"
 */
function formatHebrewDateEnglish(hdate) {
    const day = hdate.getDate()
    const monthName = getEnglishMonthName(hdate.getMonth())
    const year = hdate.getFullYear()

    return `${day} ${monthName} ${year}`
}

function getEnglishMonthName(month) {
    const monthNames = {
        [months.NISAN]: 'Nisan',
        [months.IYYAR]: 'Iyyar',
        [months.SIVAN]: 'Sivan',
        [months.TAMUZ]: 'Tamuz',
        [months.AV]: 'Av',
        [months.ELUL]: 'Elul',
        [months.TISHREI]: 'Tishrei',
        [months.CHESHVAN]: 'Cheshvan',
        [months.KISLEV]: 'Kislev',
        [months.TEVET]: 'Tevet',
        [months.SHVAT]: 'Shevat',
        [months.ADAR_I]: 'Adar I',
        [months.ADAR_II]: 'Adar II',
    }
    return monthNames[month] || ''
}

export function useHebrewDate(gregorianDate) {
    return useMemo(() => {
        if (!gregorianDate) {
            return {
                hebrew: '',
                hebrewEnglish: '',
                hdate: null
            }
        }

        try {
            // Parse the date string (format: YYYY-MM-DD)
            const [year, month, day] = gregorianDate.split('-').map(Number)
            const date = new Date(year, month - 1, day)

            // Convert to Hebrew date
            const hdate = new HDate(date)

            return {
                hebrew: formatHebrewDate(hdate),
                hebrewEnglish: formatHebrewDateEnglish(hdate),
                hdate
            }
        } catch (e) {
            console.error('Error converting date:', e)
            return {
                hebrew: '',
                hebrewEnglish: '',
                hdate: null
            }
        }
    }, [gregorianDate])
}
