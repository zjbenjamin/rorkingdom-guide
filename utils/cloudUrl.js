function isCloudUrl(url) {
  return typeof url === 'string' && url.indexOf('cloud://') === 0
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
      var field = fields[j]
      var val = result[i][field]
      if (Array.isArray(val)) {
        result[i][field] = val.slice()
        for (var a = 0; a < val.length; a++) {
          if (isCloudUrl(val[a])) {
            if (fileIDs.indexOf(val[a]) === -1) fileIDs.push(val[a])
            map.push({ index: i, field: field, arrIndex: a, fileID: val[a] })
          }
        }
      } else if (isCloudUrl(val)) {
        if (fileIDs.indexOf(val) === -1) fileIDs.push(val)
        map.push({ index: i, field: field, arrIndex: -1, fileID: val })
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
        var tempUrl = urlMap[map[m].fileID]
        if (tempUrl) {
          if (map[m].arrIndex >= 0) {
            result[map[m].index][map[m].field][map[m].arrIndex] = tempUrl
          } else {
            result[map[m].index][map[m].field] = tempUrl
          }
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
