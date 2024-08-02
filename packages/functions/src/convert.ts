import AWS from "aws-sdk";
import { S3Event, S3Handler } from "aws-lambda";

const mediaConvert = new AWS.MediaConvert({
  endpoint: process.env.MEDIACONVERT_ENDPOINT,
  region: "us-east-1",
});

export const handler: S3Handler = async (event: S3Event) => {
  const srcBucket = process.env.VIDEO_BUCKET!;
  const destBucket = process.env.HLS_BUCKET!;
  const inputKey = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );
  const outputKey = inputKey.split(".")[0]; // Remove the file extension

  const params: AWS.MediaConvert.CreateJobRequest = {
    Role: process.env.MEDIACONVERT_ROLE!,
    Settings: {
      OutputGroups: [
        {
          Name: "File Group",
          OutputGroupSettings: {
            Type: "HLS_GROUP_SETTINGS",
            HlsGroupSettings: {
              Destination: `s3://${destBucket}/${outputKey}/`,
              SegmentLength: 10,
              MinSegmentLength: 10,
            },
          },
          Outputs: [
            {
              VideoDescription: {
                CodecSettings: {
                  Codec: "H_264",
                  H264Settings: {
                    RateControlMode: "QVBR",
                    SceneChangeDetect: "ENABLED",
                    QualityTuningLevel: "SINGLE_PASS",
                    MaxBitrate: 2000000,
                  },
                },
              },
              AudioDescriptions: [
                {
                  CodecSettings: {
                    Codec: "AAC",
                    AacSettings: {
                      Bitrate: 128000,
                      CodingMode: "CODING_MODE_2_0",
                      SampleRate: 48000,
                    },
                  },
                },
              ],
              ContainerSettings: {
                Container: "M3U8",
                M3u8Settings: {},
              },
              NameModifier: "_output",
            },
          ],
        },
      ],
      Inputs: [
        {
          FileInput: `s3://${srcBucket}/${inputKey}`,
          AudioSelectors: {
            "Audio Selector 1": {
              DefaultSelection: "DEFAULT",
            },
          },
        },
      ],
    },
  };

  try {
    const data = await mediaConvert.createJob(params).promise();
    console.log("MediaConvert job created:", data);
  } catch (err) {
    console.error("Error creating MediaConvert job", err);
  }
};
