import dotenv from 'dotenv';
dotenv.config();

import { loginAndGetToken, fetchSessionToken, fetchMealDetailNutrient } from './api.js';
import { COURSE_TYPE_MAP } from './constant.js';

const formatDateLocal = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getNextWeekDays = () => {
  const today = new Date();
  const day = today.getDay();
  const daysUntilNextMonday = (8 - day) % 7 || 7;
  const mondayDate = today.getDate() + daysUntilNextMonday;

  return Array.from({ length: 5 }, (_, i) => {
    const date = new Date(today);
    date.setDate(mondayDate + i);
    return formatDateLocal(date);
  });
};



export const main = async () => {
  const queryList = [];
  const { supabase } = await import('./supabase.js');

  try {
		const accessToken = await loginAndGetToken();
		const sessionToken = await fetchSessionToken(accessToken);

    const weekdays = getNextWeekDays();

    for (const date of weekdays) {
      for (const [courseKey, courseValue] of Object.entries(COURSE_TYPE_MAP)) {
        const mealDetail = await fetchMealDetailNutrient({ date, course: courseValue, sessionToken });
        if (mealDetail.length === 0) continue;

        queryList.push({date, meal: 'LUNCH', category: courseKey, items: mealDetail});
      }
    }

    const { error } = await supabase.from('daily_menu').upsert(queryList);
    if (error)
      console.error('❌ Error inserting data:', error);
    else
      console.info('🎉 Data inserted successfully');
  } catch (err) {
    console.error('Error Response:', err.response?.status);
    console.error('Error Data:', err.response?.data);
    console.error('Error Headers:', err.response?.headers);
    console.error('Error Message:', err.message);
  }
};

