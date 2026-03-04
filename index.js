import dotenv from 'dotenv';
dotenv.config();

import { loginAndGetToken, fetchSessionToken, fetchMealDetailNutrient } from './api.js';
import { COURSE_TYPE_MAP } from './constant.js';

const toKST = (date) => new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));

const formatDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const getWeekDays = () => {
  const today = toKST(new Date());
  const day = today.getDay();
  const thisMonday = new Date(today);
  thisMonday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));

  return Array.from({ length: 10 }, (_, i) => {
    const date = new Date(thisMonday);
    date.setDate(thisMonday.getDate() + i + (i >= 5 ? 2 : 0));
    return formatDate(date);
  });
};



export const main = async () => {
  const queryList = [];
  const { supabase } = await import('./supabase.js');

  try {
		const accessToken = await loginAndGetToken();
		const sessionToken = await fetchSessionToken(accessToken);

    const weekdays = getWeekDays();

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

main();
