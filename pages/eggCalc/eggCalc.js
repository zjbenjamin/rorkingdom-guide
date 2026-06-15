var app = getApp()
var petModule = require('../../data/pets')
var petImgMap = petModule.imgMap
var db = null

function getEggImgUrl(name) {
  var fn = petImgMap[name]
  if (!fn) return ''
  return 'https://wiki.biligame.com/rocom/Special:FilePath/' + fn + '.png'
}

Page({
  data: {
    pets: [],
    filteredPets: [],
    groups: [],
    activeGroup: '',
    searchKeyword: '',
    showSuggest: false,
    suggestList: [],
    selectedPet: null,
    loading: true,
    eggGroupColors: {
      '怪兽': '#d32f2f', '虫': '#7cb342', '飞行': '#42a5f5', '毒': '#ab47bc',
      '地面': '#8d6e63', '岩石': '#78909c', '鬼': '#5c6bc0', '钢': '#90a4ae',
      '火': '#ff7043', '草': '#66bb6a', '电': '#fdd835', '龙': '#7e57c2',
      '水': '#29b6f6', '妖精': '#f48fb1', '格斗': '#ef5350', '冰': '#26c6da',
      '超能力': '#ec407a', '恶': '#455a64'
    },
    eggTypeEmoji: {
      '火': '🔥', '水': '💧', '草': '🌿', '电': '⚡', '冰': '❄️',
      '龙': '🐉', '恶': '👿', '飞行': '🕊️', '格斗': '👊', '毒': '☠️',
      '地面': '⛰️', '岩石': '🪨', '鬼': '👻', '钢': '⚙️', '妖精': '🧚',
      '超能力': '🔮', '虫': '🐛', '普通': '⭐'
    },
    eggTypeColors: {
      '火': '#ff7043', '水': '#29b6f6', '草': '#66bb6a', '电': '#fdd835',
      '冰': '#26c6da', '龙': '#7e57c2', '恶': '#455a64', '飞行': '#42a5f5',
      '格斗': '#ef5350', '毒': '#ab47bc', '地面': '#8d6e63', '岩石': '#78909c',
      '鬼': '#5c6bc0', '钢': '#90a4ae', '妖精': '#f48fb1', '超能力': '#ec407a',
      '虫': '#7cb342', '普通': '#ffa726'
    }
  },
  onLoad: function() {
    this.loadData()
  },
  loadData: function() {
    var self = this
    self.setData({ loading: true })
    if (wx.cloud) {
      db = wx.cloud.database()
      wx.cloud.callFunction({
        name: 'eggQuery',
        data: { action: 'groups' }
      }).then(function(res) {
        if (res.result && res.result.success) {
          self.setData({ groups: res.result.data })
        }
      }).catch(function() {})
      wx.cloud.callFunction({
        name: 'eggQuery',
        data: { action: 'query' }
      }).then(function(res) {
        if (res.result && res.result.success) {
          var pets = res.result.data
          for (var i = 0; i < pets.length; i++) {
            if (pets[i].group) {
              pets[i].groupStr = pets[i].group.join(', ')
            } else {
              pets[i].groupStr = ''
            }
            pets[i].imgUrl = getEggImgUrl(pets[i].name)
          }
          self.setData({ pets: pets, filteredPets: pets, loading: false })
        } else {
          self.setData({ loading: false })
        }
      }).catch(function() {
        self.setData({ loading: false })
      })
    } else {
      self.setData({ loading: false })
    }
  },
  onSearchInput: function(e) {
    var keyword = e.detail.value.trim()
    this.setData({ searchKeyword: keyword })
    if (keyword) {
      this.doSearch(keyword)
    } else {
      this.setData({ showSuggest: false, suggestList: [] })
      this.filterByGroup()
    }
  },
  doSearch: function(keyword) {
    var self = this
    var results = []
    var pets = self.data.pets
    for (var i = 0; i < pets.length; i++) {
      if (pets[i].name.indexOf(keyword) >= 0) {
        results.push(pets[i])
      }
    }
    self.setData({ showSuggest: true, suggestList: results.slice(0, 10) })
    if (results.length > 0) {
      self.setData({ filteredPets: results, activeGroup: '' })
    }
  },
  selectSuggest: function(e) {
    var item = e.currentTarget.dataset.item
    this.setData({
      selectedPet: item,
      searchKeyword: item.name,
      showSuggest: false,
      suggestList: [],
      filteredPets: [item]
    })
  },
  clearSearch: function() {
    this.setData({ searchKeyword: '', showSuggest: false, suggestList: [], selectedPet: null })
    this.filterByGroup()
  },
  selectGroup: function(e) {
    var group = e.currentTarget.dataset.group
    this.setData({ activeGroup: group, searchKeyword: '', selectedPet: null, showSuggest: false })
    this.filterByGroup()
  },
  filterByGroup: function() {
    var self = this
    var group = self.data.activeGroup
    var pets = self.data.pets
    if (!group) {
      self.setData({ filteredPets: pets })
      return
    }
    var filtered = []
    for (var i = 0; i < pets.length; i++) {
      if (pets[i].group && pets[i].group.indexOf(group) >= 0) {
        filtered.push(pets[i])
      }
    }
    self.setData({ filteredPets: filtered })
  },
  selectPet: function(e) {
    var item = e.currentTarget.dataset.item
    this.setData({ selectedPet: item })
  },
  go: function(e) { wx.navigateTo({ url: e.currentTarget.dataset.url }) }
})
