import api from '@/lib/axios';
import { validatePassword } from '@/utils/utils';  // utils에서 validatePassword 함수 import
import { Router } from 'next/router';

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

export async function changePassword(data: PasswordChangeData) {
  // 유효성 검사 추가
  if (!validatePassword(data.currentPassword) || !validatePassword(data.newPassword)) {
    return { success: false, message: '비밀번호 형식이 올바르지 않습니다.' };
  }

  try {
    const accessToken = sessionStorage.getItem('accessToken');

    if (!accessToken) {
      return { success: false, message: '인증 정보가 없습니다.' };
    }

    const response = await api.put(
      '/user/auth/password-update',
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (response.status === 200) {
      return { success: true, message: '비밀번호가 성공적으로 변경되었습니다.' };
    } else {
      return { success: false, message: '비밀번호 변경에 실패했습니다.' };
    }

  } catch (error) {
    return { success: false, message: '비밀번호 변경에 실패했습니다.' };
  }
}