# Generated by Django 4.2.14 on 2024-08-06 06:22

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CommingData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('answerVoiceFileName', models.TextField()),
                ('userVoiceFileName', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='SendingData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('voiceSimilarity', models.IntegerField()),
                ('scriptSimilarity', models.IntegerField()),
                ('answerVoicePitch', models.TextField()),
                ('userVoicePitch', models.TextField()),
                ('userVoicetime', models.TextField()),
                ('userScript', models.TextField()),
            ],
        ),
    ]
