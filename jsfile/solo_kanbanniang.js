var soloKanbanniang = {
    clearTime: '',
    showMessage: function (text, timeout) {
      if (sessionStorage.getItem('soloKanbanniang') === 'close') {
        return
      }
      if (Array.isArray(text)) {
        text = text[Math.floor(Math.random() * text.length + 1) - 1]
      }
      $('.solo-kanbanniang__tip').html(text).fadeTo(200, 1)
      clearTimeout(this.clearTime)
      this.clearTime = setTimeout(function () {
        $('.solo-kanbanniang__tip').fadeTo(200, 0)
      }, timeout)
    },
    _initMove: function () {
      if (sessionStorage.soloKanbanniangX) {
        $('.solo-kanbanniang').css('left', sessionStorage.soloKanbanniangX + 'px')
      }
      if (sessionStorage.soloKanbanniangY) {
        $('.solo-kanbanniang').css('top', sessionStorage.soloKanbanniangY + 'px')
      }
      $('.solo-kanbanniang').mousedown(function (event) {
        var _document = document
        if (!event) {
          event = window.event
        }
        var dialog = this
        var x = event.clientX - parseInt(dialog.style.left || 0),
          y = event.clientY -
            parseInt(dialog.style.top || $(window).height() - $(dialog).height())
        _document.ondragstart = 'return false;'
        _document.onselectstart = 'return false;'
        _document.onselect = 'document.selection.empty();'
  
        if (this.setCapture) {
          this.setCapture()
        } else if (window.captureEvents) {
          window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP)
        }
  
        _document.onmousemove = function (event) {
          if (!event) {
            event = window.event
          }
          var positionX = event.clientX - x,
            positionY = event.clientY - y
          if (positionX < 0) {
            positionX = 0
          }
          if (positionX > $(window).width() - $(dialog).width()) {
            positionX = $(window).width() - $(dialog).width()
          }
          if (positionY < 0) {
            positionY = 0
          }
          if (positionY > $(window).height() - $(dialog).height()) {
            positionY = $(window).height() - $(dialog).height()
          }
          dialog.style.left = positionX + 'px'
          dialog.style.top = positionY + 'px'
          sessionStorage.setItem('soloKanbanniangX', positionX)
          sessionStorage.setItem('soloKanbanniangY', positionY)
        }
  
        _document.onmouseup = function () {
          if (this.releaseCapture) {
            this.releaseCapture()
          } else if (window.captureEvents) {
            window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP)
          }
          _document.onmousemove = null
          _document.onmouseup = null
          _document.ondragstart = null
          _document.onselectstart = null
          _document.onselect = null
        }
      })
    },
    _initTips: function () {
      $.ajax({
        cache: true,
        url: 'https://yuanhuang2807.github.io/tips.json',
        dataType: 'json',
        success: function (result) {
          $.each(result.mouseover, function (index, tips) {
            $(document).on('mouseover', tips.selector, function () {
              soloKanbanniang.showMessage(
                tips.text.replace('{text}', $.trim($(this).text()).substr(0, 42)),
                3000)
            })
          })
          $.each(result.click, function (index, tips) {
            $(document).on('click', tips.selector, function () {
              var text = tips.text[Math.floor(Math.random() * tips.text.length +
                1) - 1]
              soloKanbanniang.showMessage(text, 3000, true)
            })
          })
          $.each(result.seasons, function (index, tips) {
            var now = new Date()
            var after = tips.date.split('-')[0]
            var before = tips.date.split('-')[1] || after
  
            if ((after.split('/')[0] <= now.getMonth() + 1 &&
              now.getMonth() + 1 <= before.split('/')[0]) &&
              (after.split('/')[1] <= now.getDate() &&
                now.getDate() <= before.split('/')[1])) {
              soloKanbanniang.showMessage(
                tips.text.replace('{year}', now.getFullYear()), 6000, true)
            }
          })
        },
      })
    },
    _initMenu: function () {
      $('#soloKanbanniangHome').click(function () {
        window.location = Label.servePath
      })
  
      $('#soloKanbanniangRSS').click(function () {
        window.location = Label.servePath + '/rss.xml'
      })
  
      $('#soloKanbanniangGithub').click(function () {
        window.location = 'https://github.com/b3log/solo'
      })
  
      $('#soloKanbanniangChat').click(function () {
        soloKanbanniang.showChat()
        soloKanbanniang.bgChange()
      })
  
      $('#soloKanbanniangChange').click(function () {
        loadlive2d('soloKanbanniang',
          'https://ld246.com/kanbanniang/model?t=' + (new Date()).getTime(),
          soloKanbanniang.showMessage('Đồ mới của tao đấy! Đẹp không?', 3000, true))
        soloKanbanniang.bgChange()
      })
  
      $('#soloKanbanniangClose').click(function () {
        soloKanbanniang.showMessage('Hẹn gặp lại nhé Wibu đê tiện', 1300, true)
        sessionStorage.setItem('soloKanbanniang', 'close')
        window.setTimeout(function () {
          $('.solo-kanbanniang').hide()
        }, 1300)
      })
  
      $('#soloKanbanniangPhoto').click(function () {
        soloKanbanniang.showMessage('Chụp xong rồi hả thằng Wibu?', 5000, true)
        window.Live2D.captureName = 'solo.png'
        window.Live2D.captureFrame = true
      })
    },
    _initFirstMsg: function () {
      var text
      var referrer = document.createElement('a')
      if (document.referrer !== '') {
        referrer.href = document.referrer
      }
  
      if (referrer.href !== '' && referrer.hostname !==
        Label.servePath.split('//')[1].split(':')[0]) {
        var referrer = document.createElement('a')
        referrer.href = document.referrer
        text = 'Hello! Chào một thằng Wibu đến từ <span style="color:#4285f4;">' + referrer.hostname +
          '</span> nhé!'
        var domain = referrer.hostname.split('.')[1]
        if (domain == 'baidu') {
          text = 'Hello! 来自 百度搜索 的朋友<br>你是搜索 <span style="color:#4285f4;">' +
            referrer.search.split('&wd=')[1].split('&')[0] + '</span> 找到的我吗？'
        } else if (domain == 'so') {
          text = 'Hello! 来自 360搜索 的朋友<br>你是搜索 <span style="color:#4285f4;">' +
            referrer.search.split('&q=')[1].split('&')[0] + '</span> 找到的我吗？'
        } else if (domain == 'google') {
          text = 'Hello! 来自 谷歌搜索 的朋友<br>欢迎阅读<span style="color:#4285f4;">『' +
            document.title.split(' - ')[0] + '』</span>'
        }
      } else {
        var now = (new Date()).getHours()
        if (now > 23 || now <= 5) {
          text = 'Thức khuya thế làm gì :( đi ngủ sớm đi kẻo mình lo!'
        } else if (now > 5 && now <= 7) {
          text = 'Trời sáng rồi, chúc bạn có một ngày vui vẻ nhé :P'
        } else if (now > 7 && now <= 11) {
          text = 'Đã đến giờ đến trường với đi làm rồi đấy, cùng nhau cố gắng nhé！加油！'
        } else if (now > 11 && now <= 14) {
          text = 'Nghỉ trưa thôi nào, buổi sáng của bạn có tốt không? Hãy tiếp tục cố gắng nhé :P！'
        } else if (now > 14 && now <= 17) {
          text = 'Buổi chiều khiến cho con người ta buồn ngủ quá đi thôi :( nhưng vẫn phải tiếp tục nhỉ!'
        } else if (now > 17 && now <= 19) {
          text = 'Khoảng thời gian đẹp nhất của một ngày là khi nào? Là những lúc chiều muộn như này đấy! Thư giản đi nào...'
        } else if (now > 19 && now <= 21) {
          text = 'Ngày hôm nay của bạn sao rồi？Vẫn tốt cả nhỉ, cuộc sống là một cuộc hành trình, hôm nay bạn đã đi được thêm rồi đấy! Cùng tiếp tục đi nào!'
        } else if (now > 21 && now <= 23) {
          text = 'Muộn lắm rồi đấy! Đi ngủ thôi! :> Chúc bạn ngủ ngon! 晚安！'
        } else {
          text = '嗨~ 快来逗我玩吧！'
        }
      }
      soloKanbanniang.showMessage(text, 6000)
    },
    init: function () {
      this._initTips()
      this._initMenu()
      this._initFirstMsg()
      this._initMove()
  
      soloKanbanniang.bgChange()
  
      window.setInterval(soloKanbanniang.showChat, 30000)
  
      $(document).on('copy', function () {
        soloKanbanniang.showMessage('Vừa copy cái gì xong đúng không -_-', 5000, true)
      })
    },
    showChat: function () {
      if (sessionStorage.getItem('soloKanbanniang') !== 'close') {
        $.getJSON(
          'https://api.imjad.cn/hitokoto/?cat=&charset=utf-8&length=55&encode=json',
          function (result) {
            soloKanbanniang.showMessage(result.hitokoto, 5000)
          })
      }
    },
    bgChange: function () {
      $('.solo-kanbanniang').
        css('background-image',
          'url(https://cdn.jsdelivr.net/npm/kanbanniang-tia/background/sakura' +
          Math.floor(Math.random() * 11) + '.gif)')
    },
  }
  
  if (navigator.userAgent.indexOf('MSIE') === -1 && $(window).width() > 720) {
    $(document).ready(function () {
      if (sessionStorage.getItem('soloKanbanniang') === 'close') {
        $('.solo-kanbanniang').remove()
        return
      }
  
      $.ajax({
        url: 'https://cdn.jsdelivr.net/npm/kanbanniang@0.2.6/live2d.js',
        dataType: 'script',
        cache: true,
        success: function () {
          soloKanbanniang.init()
  
          loadlive2d('soloKanbanniang',
            'https://ld246.com/kanbanniang/model?t=' + (new Date()).getTime())
        },
      })
    })
  } else {
    $(document).ready(function () {
      $('.solo-kanbanniang').remove()
    })
  }
