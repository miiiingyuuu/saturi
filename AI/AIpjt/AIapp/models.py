from django.db import models

class CommingData(models.Model):
    answerVoiceFileName = models.TextField()
    userVoiceFileName = models.TextField()


class SendingData(models.Model):
    voiceSimilarity = models.DecimalField(max_digits=4, decimal_places=2)
    scriptSimilarity = models.DecimalField(max_digits=4, decimal_places=2)
    answerVoicePitch = models.JSONField()
    userVoicePitch = models.JSONField()
    userScript = models.TextField()
