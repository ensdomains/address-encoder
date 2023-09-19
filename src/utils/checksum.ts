export type ChecksumFn = (s: Uint8Array) => Uint8Array;

export const createChecksumEncoder =
  (checksumLength: number, checksumFn: ChecksumFn) =>
  (source: Uint8Array): Uint8Array => {
    const checksum = checksumFn(source).slice(0, checksumLength);
    const res = new Uint8Array(source.length + checksumLength);
    res.set(source);
    res.set(checksum, source.length);
    return res;
  };

export const createChecksumDecoder =
  (checksumLength: number, checksumFn: ChecksumFn) =>
  (source: Uint8Array): Uint8Array => {
    const payload = source.slice(0, -checksumLength);
    const checksum = source.slice(-checksumLength);
    const newChecksum = checksumFn(payload).slice(0, checksumLength);
    for (let i = 0; i < checksumLength; i++) {
      if (checksum[i] !== newChecksum[i]) throw Error("Invalid checksum");
    }
    return payload;
  };
