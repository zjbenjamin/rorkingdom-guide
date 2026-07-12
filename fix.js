const fs = require('fs');
let lines = fs.readFileSync('F:/rorkingdom-guide/pages/merchant/merchant.js', 'utf8').split('\n');

let start = lines.findIndex(l => l.includes('openAddSellingItemModal: function'));
let end = lines.findIndex((l, i) => i > start && l.includes('openSellingModal: function'));

let newCode = `  openAddSellingItemModal: function() {
    var self = this
    if (this.data.currentSelling.length >= 8) {
      wx.showToast({ title: '最多8件商品', icon: 'none' })
      return
    }
    
    var currentIds = {}
    self.data.currentSelling.forEach(function(item) {
      currentIds[item.name + '_' + item.price] = true
    })
    var available = []
    self.data.items.forEach(function(item) {
      if (!currentIds[item.name + '_' + item.price]) {
        available.push(item)
      }
    })
    
    this.setData({ 
      showAddSellingItemModal: true,
      availableItems: available,
      selectedForSelling: {}
    })
  },
  closeAddSellingItemModal: function() {
    this.setData({ showAddSellingItemModal: false })
  },
  toggleSellingItemSelection: function(e) {
    var item = e.currentTarget.dataset.item
    var selected = Object.assign({}, this.data.selectedForSelling)
    if (!selected[item.id]) {
      var count = Object.keys(selected).length
      if (this.data.currentSelling.length + count >= 8) {
        wx.showToast({ title: '最多只能上架8件商品', icon: 'none' })
        return
      }
      selected[item.id] = true
    } else {
      delete selected[item.id]
    }
    this.setData({ selectedForSelling: selected })
  },
  confirmAddSellingItems: function() {
    var self = this
    var selected = this.data.selectedForSelling
    var selectedIds = Object.keys(selected)
    if (selectedIds.length === 0) {
      this.closeAddSellingItemModal()
      return
    }
    
    var itemsToAdd = []
    self.data.availableItems.forEach(function(item) {
      if (selected[item.id]) {
        itemsToAdd.push(item)
      }
    })
    
    var updated = self.data.currentSelling.concat(itemsToAdd)
    var text = serializeItems(updated)
    var updateData = { currentSelling: text, updateTime: db.serverDate() }
    
    wx.showLoading({ title: '上架中...' })
    db.collection('page_config').doc('merchant').update({
      data: updateData
    }).then(function() {
      wx.hideLoading()
      var nextState = { currentSellingText: text, showAddSellingItemModal: false, selectedForSelling: {}, availableItems: [] }
      self.setData(nextState)
      self.syncSellingArrays(updated)
      wx.showToast({ title: '已上架', icon: 'success' })
      if(typeof self.updateSellingSilent === 'function') self.updateSellingSilent()
    }).catch(function() {
      wx.hideLoading()
      self.setData({ showAddSellingItemModal: false })
      wx.showToast({ title: '上架失败', icon: 'none' })
    })
  },`.split('\n');

if (start !== -1 && end !== -1) {
  let finalLines = lines.slice(0, start).concat(newCode).concat(lines.slice(end));
  fs.writeFileSync('F:/rorkingdom-guide/pages/merchant/merchant.js', finalLines.join('\n'), 'utf8');
  console.log('Replaced correctly!');
} else {
  console.log('Could not find start/end indices.', start, end);
}
