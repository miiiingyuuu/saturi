from django.db import models

class CommingData(models.Model):
    answerVoiceFileName = models.TextField()
    userVoiceFileName = models.TextField()


class SendingData(models.Model):
    voiceSimilarity = models.IntegerField()
    scriptSimilarity = models.IntegerField()
    answerVoicePitch = models.TextField()
    userVoicePitch = models.TextField()
    userVoicetime = models.TextField()
    userScript = models.TextField()
