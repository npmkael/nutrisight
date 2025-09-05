import type { CameraCapturedPicture } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";

/**
 * Crop the center square of a CameraCapturedPicture and resize to 256x256.
 * Returns a base64 JPEG string (no data: prefix).
 *
 * Requires the CameraCapturedPicture to include width and height (most expo camera results do).
 */
export async function cropCenterTo256Base64(
  photo: CameraCapturedPicture
): Promise<string> {
  const uri = photo.uri;
  const width = (photo as any).width;
  const height = (photo as any).height;

  if (!uri) throw new Error("cropCenterTo256Base64: photo.uri is required");
  if (!width || !height)
    throw new Error(
      "cropCenterTo256Base64: photo.width and photo.height are required"
    );

  const size = Math.min(width, height);
  const originX = Math.floor((width - size) / 2);
  const originY = Math.floor((height - size) / 2);

  const actions: ImageManipulator.Action[] = [
    { crop: { originX, originY, width: size, height: size } },
    { resize: { width: 256, height: 256 } },
  ];

  const result = await ImageManipulator.manipulateAsync(uri, actions, {
    compress: 0.9,
    format: ImageManipulator.SaveFormat.JPEG,
    base64: true,
  });

  if (!result.base64)
    throw new Error("cropCenterTo256Base64: failed to produce base64");
  return result.base64;
}

/**
 * Convenience wrapper: if you only have a URI and dimensions, use this.
 * If width/height are omitted it will attempt to run a simple resize to 256 (no guaranteed center-crop).
 */
export async function cropCenterTo256Base64FromUri(
  uri: string,
  width?: number,
  height?: number
): Promise<string> {
  if (!width || !height) {
    // Fallback: just resize (best-effort) if dimensions unknown
    const r = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 256, height: 256 } }],
      { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );
    if (!r.base64)
      throw new Error("cropCenterTo256Base64FromUri: failed to produce base64");
    return r.base64;
  }
  return cropCenterTo256Base64({ uri, width, height } as CameraCapturedPicture);
}
