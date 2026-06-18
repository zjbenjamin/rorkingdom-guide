function isCloudUrl(url) {
  return url && url.indexOf('cloud://') === 0
}

function convertList(list, fields, callback) {
  if (!list || list.length === 0 || !wx.cloud) {
    callback(list)
    return
  }
  if (typeof fields === 'string') fields = [fields]
  var result = list.map(function(item) { return Object.assign({}, item) })
  var fileIDs = []
  var map = []
  for (var i = 0; i < result.length; i++) {
    for (var j = 0; j < fields.length; j++) {
      var val = result[i][fields[j]]
      if (isCloudUrl(val)) {
        fileIDs.push(val)
        map.push({ index: i, field: fields[j], fileID: val })
      }
    }
  }
  if (fileIDs.length === 0) {
    callback(result)
    return
  }
  wx.cloud.getTempFileURL({ fileList: fileIDs })
    .then(function(res) {
      var urlMap = {}
      if (res.fileList) {
        for (var k = 0; k < res.fileList.length; k++) {
          if (res.fileList[k].tempFileURL) {
            urlMap[res.fileList[k].fileID] = res.fileList[k].tempFileURL
          }
        }
      }
      for (var m = 0; m < map.length; m++) {
        if (urlMap[map[m].fileID]) {
          result[map[m].index][map[m].field] = urlMap[map[m].fileID]
        }
      }
      callback(result)
    })
    .catch(function() {
      callback(result)
    })
}

module.exports = {
  isCloudUrl: isCloudUrl,
  convertList: convertList
}
