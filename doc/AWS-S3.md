# How to use

+ To get link to upload to AWS S3, send `POST` request to `{{url}}/api/s3-presigned-link` as following format

```json
{
	"videoName": "shz_aNewVideoName",
    "scheduleId": 2
}
```

+ Response should be like:

```json
{
    "code": 200,
    "message": "Success",
    "data": {
        "presignedLink": "https://shozemi-video.s3.ap-northeast-1.amazonaws.com/f64df094-0142-48a2-a7bc-4fab4edee356-shz_aNewVideoName.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA6GU7CM5PTUQWHXFV%2F20200922%2Fap-northeast-1%2Fs3%2Faws4_request&X-Amz-Date=20200922T015620Z&X-Amz-Expires=86400&X-Amz-Signature=b12565e4a43dcf92d7a147b717d0f53e1d339f07ed467f7f1e16a66e9c8de95d&X-Amz-SignedHeaders=host%3Bx-amz-acl&x-amz-acl=public-read",
        "videoName": "shz_aNewVideoName",
        "videoUrl": "https://shozemi-video.s3-ap-northeast-1.amazonaws.com/f64df094-0142-48a2-a7bc-4fab4edee356-shz_aNewVideoName.mp4",
        "expireIn": 86400
    }
}
```

+ After that, send `PUT` request to `data.presignedLink`.
+ When finished upload, send `PATCH request` to `{{url}}/api/s3-presigned-link/confirm-video-uploaded` to confirm that the video has been uploaded successfully

```json
{
	"videoName": "{{videoName}}",
    "videoUrl": "{{videoUrl}}"
}
```

+ Response shoule be like

```json
{
    "code": 200,
    "message": "Success",
    "data": [
        1
    ]
}
```