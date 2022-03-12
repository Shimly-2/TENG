// 字符串转byte
function stringToBytes(str) {
  var strArray = new Uint8Array(str.length);
  for (var i = 0; i < str.length; i++) {
    strArray[i] = str.charCodeAt(i);
  }
  const array = new Uint8Array(strArray.length)
  strArray.forEach((item, index) => array[index] = item)
  return array.buffer;
}

// ArrayBuffer转16进制字符串示例
function ab2hext(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}

//16进制转字符串
function hexToString(str) {
  var trimedStr = str.trim();
  var rawStr =
    trimedStr.substr(0, 2).toLowerCase() === "0x" ?
      trimedStr.substr(2) :
      trimedStr;
  var len = rawStr.length;
  if (len % 2 !== 0) {
    // alert("Illegal Format ASCII Code!");
    return "";
  }
  var curCharCode;
  var resultStr = [];
  for (var i = 0; i < len; i = i + 2) {
    curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
    resultStr.push(String.fromCharCode(curCharCode));
  }
  return resultStr.join("");
}

function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer.value), x => ('00' + x.toString(16)).slice(-2)).join('');
}

function uint2float(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Float32Array(buffer.value), x => ('00' + x.toString(16)).slice(-2)).join('');
}

/**
 * TypedArray转为ArrayBuffer
 */
function typedArray2ArrayBuffer(pbuff) {
  let buffer = new ArrayBuffer(pbuff.byteLength)
  let uInit8 = new Uint8Array(buffer)
  uInit8.set(pbuff);
  return buffer;
}

/**
 * 字符串转为ArrayBuffer对象，参数为字符串
 */
function str2ab(str) {
  var buf = new ArrayBuffer(str.length / 2);
  var bufView = new Uint8Array(buf);
  for (var i = 0; i < str.length; i += 2) {
    bufView[parseInt(i / 2)] = char2Hex(str.charCodeAt(i)) << 4 | char2Hex(str.charCodeAt(i + 1));
  }
  return buf;
}

/*微信app版本比较*/
function versionCompare(ver1, ver2) {
  var version1pre = parseFloat(ver1)
  var version2pre = parseFloat(ver2)
  var version1next = parseInt(ver1.replace(version1pre + ".", ""))
  var version2next = parseInt(ver2.replace(version2pre + ".", ""))
  if (version1pre > version2pre)
    return true
  else if (version1pre < version2pre)
    return false
  else {
    if (version1next > version2next)
      return true
    else
      return false
  }
}

module.exports = {
  stringToBytes: stringToBytes,
  ab2hext: ab2hext,
  hexToString: hexToString,
  buf2hex:buf2hex,
  uint2float:uint2float,
  typedArray2ArrayBuffer:typedArray2ArrayBuffer,
  str2ab:str2ab,
  versionCompare: versionCompare
}
