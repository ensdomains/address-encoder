'use strict';

// Copied from https://github.com/zelcash/groestl-hash-js
import  { groestll } from './groestl';
import { int32ArrayToHexString, int32Buffer2Bytes}  from './helper.js';


export function groestl_2(str,format, output) {
  var a = groestll(str,format,2);
  a = groestll(a,2,2);
  a = a.slice(0,8);
  if (output === 2) {
    return a;
  }
  else if (output === 1) {
    return int32Buffer2Bytes(a);
  }
  else {
    return int32ArrayToHexString(a);
  }
}