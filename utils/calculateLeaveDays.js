const Holiday = require('../models/Holiday')

const calculateLeaveDays = async (
  startDate,
  endDate,
  isHalfDay = false
) => {

  const holidays = await Holiday.find()

  const holidayDates = holidays.map(
    (holiday) =>
      holiday.date.toISOString().split('T')[0]
  )

  let totalDays = 0

  let current = new Date(startDate)

  while (current <= new Date(endDate)) {

    const currentDate =
      current.toISOString().split('T')[0]

    const day = current.getDay()

    // Skip holidays
    if (holidayDates.includes(currentDate)) {
      current.setDate(current.getDate() + 1)
      continue
    }

    // Skip Sunday
    if (day === 0) {
      current.setDate(current.getDate() + 1)
      continue
    }

    // Saturday
    if (day === 6) {

      totalDays += isHalfDay ? 0.25 : 0.5

    } else {

      totalDays += isHalfDay ? 0.5 : 1
    }

    current.setDate(current.getDate() + 1)
  }

  return totalDays
}

module.exports = calculateLeaveDays