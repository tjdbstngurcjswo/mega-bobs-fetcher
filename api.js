
import axios from 'axios';
import qs from 'qs';
import { RESTAURANT_ID } from './constant.js';

export async function loginAndGetToken() {
  const loginResponse = await axios.post(
    'https://welplus.welstory.com/login',
    qs.stringify({
      username: process.env.USER_ID,
      password: process.env.USER_PW,
      'remember-me': 'false',
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        'X-Device-Id': process.env.DEVICE_ID,
        'X-Autologin': 'N',
      },
    }
  );

  return loginResponse.headers['authorization'];
}

export async function fetchSessionToken(loginAccessToken) {
  const response = await axios.get('https://welplus.welstory.com/session', {
    headers: {
      Authorization: loginAccessToken,
      'X-Device-Id': process.env.DEVICE_ID,
      'X-Autologin': 'N',
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      Referer: 'https://welplus.welstory.com/',
      'User-Agent':
        'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Welplus/1.01.16',
    },
  });

  return response.data.data;
}


export async function getMealMenu(sessionToken, dateStr, restaurantCode) {
  const yyyymmdd = dateStr.replace(/-/g, '');

  const url = `https://welplus.welstory.com/api/meal?menuDt=${yyyymmdd}&menuMealType=2&restaurantCode=${restaurantCode}&sortingFlag=basic&mainDivRestaurantCode=${restaurantCode}&activeRestaurantCode=${restaurantCode}`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${sessionToken}`,
      'X-Autologin': 'N',
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Welplus/1.01.16',
      'X-Device-Id': '01B4D1EB-3518-4F64-BC67-EA60671D4090',
      Referer: 'https://welplus.welstory.com/',
      'Sec-Fetch-Dest': 'empty',
      Connection: 'keep-alive',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Welplus/1.01.16',
    },
  });

  return response.data.data.mealList;
}


export async function fetchMealDetailNutrient({
  date,
  course,
  sessionToken,
}) {
  const yyyymmdd = date.replace(/-/g, '');

  const url = `https://welplus.welstory.com/api/meal/detail/nutrient?menuDt=${yyyymmdd}&hallNo=E5Z5&menuCourseType=${course}&menuMealType=2&restaurantCode=${RESTAURANT_ID}&mainDivRestaurantCode=${RESTAURANT_ID}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Host: "welplus.welstory.com",
        Accept: "application/json, text/plain, */*",
        Authorization: `Bearer ${sessionToken}`,
        "Sec-Fetch-Site": "same-origin",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Sec-Fetch-Mode": "cors",
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Welplus/1.01.16",
        "X-Device-Id": "01B4D1EB-3518-4F64-BC67-EA60671D4090",
        Referer: "https://welplus.welstory.com/",
        Connection: "keep-alive",
        "X-Autologin": "N",
        "Sec-Fetch-Dest": "empty",
      },
    });

    const data = response.data.data;
    if (!data || !Array.isArray(data)) return [];

    const meals = data.map((item) => ({
      name: item.menuName,
      kcal: Number(item.kcal) || 0,
    }));

    return meals;
  } catch (err) {
    console.error(`[${course}] ${date} meal fetch failed`, err);
    return [];
  }
}
