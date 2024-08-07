import api from '@/lib/axios';
import { validatePassword } from '@/utils/utils';  // utils에서 validatePassword 함수 import

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

export async function changePassword(data: PasswordChangeData) {
  // 유효성 검사 추가
  if (!validatePassword(data.currentPassword)) {
    return { success: false, message: '현재 비밀번호가 일치하지 않습니다.' };
  } else if (!validatePassword(data.newPassword)) {
    return { success: false, message: '새 비밀번호는 8글자 이상, 숫자와 특수문자를 포함해야 합니다.' };
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
      return { success: true, message: '비밀번호가 변경되었습니다.' };
    } else {
      return { success: false, message: '비밀번호 변경에 실패했습니다.' };
    }

  } catch (error) {
    return { success: false, message: '비밀번호를 정확하게 입력해주세요.' };
  }
}