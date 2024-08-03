from rest_framework import serializers
from .models import CommingData, SendingData

class CommingDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommingData
        fields = '__all__'  # 모든 필드를 사용
        # 또는 특정 필드를 명시적으로 지정

class SendingDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = SendingData
        fields = '__all__'
