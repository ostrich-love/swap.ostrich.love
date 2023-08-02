import { error } from "console";
import { dc_client_id, dc_client_secret, ostrich_discord_id } from "../global";
 // 获取用户群组数据
 export const fetchGuildUserData = async (accessToken, userId) => {
    if(!accessToken) {
        return
    }
    const response = await fetch(`https://discord.com/api/users/@me/guilds/${ostrich_discord_id}/member`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    if (response.ok) {
      // 用户数据获取成功，保存用户数据
      console.log(data);
      return data
    } else {
      // 用户数据获取失败，处理错误
      throw ('Failed to fetch user info:', data.error);
    }
  };
 // 获取用户数据
 export const fetchUserData = async (accessToken) => {
    if(accessToken == localStorage.getItem('used_dc_accessToken') || !accessToken) {
        return
    } else {
        localStorage.setItem('used_dc_accessToken', accessToken)
    }
    const response = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    if (response.ok) {
      // 用户数据获取成功，保存用户数据
      console.log(data);
      return data
    } else {
      // 用户数据获取失败，处理错误
      throw ('Failed to fetch user info:', data.error);
    }
  };
   // 获取用户数据
 export const fetchUserGuilds = async (accessToken) => {
    if(!accessToken) {
        return
    }
    const response = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    if (response.ok) {
      // 用户数据获取成功，保存用户数据
      console.log(data);
      return data
    } else {
      // 用户数据获取失败，处理错误
      throw ('Failed to fetch user info:', data.error);
    }
  };

   
    // 获取访问令牌
    export const fetchAccessToken = async (code) => {
        if(code == localStorage.getItem('used_dc_code') || !code) {
            return
        } else {
            localStorage.setItem('used_dc_code', code)
        }
        const response = await fetch('https://discord.com/api/oauth2/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: dc_client_id,
            client_secret: dc_client_secret,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: window.location.origin + '/quest',
            scope: 'identify guilds',
          }),
        });
  
        const data = await response.json();
        if (response.ok) {
          // 访问令牌获取成功，获取用户数据
          console.log(data)
          return (data.access_token)
        } else {
          // 访问令牌获取失败，处理错误
          throw ('Failed to fetch access token:', data.error);
        }
      };