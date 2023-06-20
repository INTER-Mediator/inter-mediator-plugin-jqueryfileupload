/*
 * INTER-Mediator
 * Copyright (c) INTER-Mediator Directive Committee (http://inter-mediator.org)
 * This project started at the end of 2009 by Masayuki Nii msyk@msyk.net.
 *
 * INTER-Mediator is supplied under MIT License.
 * Please see the full license for details:
 * https://github.com/INTER-Mediator/INTER-Mediator/blob/master/dist-docs/License.txt
 *
 * This plugin requres the following libraries, they can include with CDN services.
 * The sample file "fileupload_jQuery_MySQL.html" of INTER-Mediator loacated
 * "INTER-Mediator/samples/Sample_webpage/" includes the loading code ot them.
 *
 * Bootstrap (http://getbootstrap.com/)
 * JQuery (https://jquery.com/)
 * jQuery UI (https://api.jqueryui.com/)
 * Blueimp jQuery File Upload (https://github.com/blueimp/jQuery-File-Upload)
 */
IMParts_Catalog.jquery_fileupload = {
  panelWidth: '200px',
  selectButtonClasses: 'btn btn-success fileinput-button',
  sendButtonClasses: 'btn btn-primary filesend-button',
  fullUpdate: true,
  isShowProgressBar: true,
  isShowPreview: true,
  multiFileInPostOnly: false,
  fileExtRequirements: null, // or ['csv']

  instanciate: function (targetNode) {
    let container, node, nodeId, pNode = targetNode
    nodeId = targetNode.getAttribute('id')
    this.ids.push(nodeId)

    container = document.createElement('DIV')
    container.setAttribute('class', 'jquery-fileupload-container')
    container.style.width = this.panelWidth
    pNode.appendChild(container)

    node = document.createElement('SPAN')
    node.setAttribute('class', IMParts_Catalog.jquery_fileupload.selectButtonClasses)
    container.appendChild(node)
    pNode = node

    node = document.createElement('I')
    node.setAttribute('class', 'glyphicon glyphicon-plus')
    pNode.appendChild(node)
    node = document.createElement('SPAN')
    node.appendChild(document.createTextNode(INTERMediatorOnPage.getMessages()[3209]))
    pNode.appendChild(node)
    node = document.createElement('INPUT')
    node.setAttribute('id', nodeId + '-fileupload')
    node.setAttribute('type', 'file')
    node.setAttribute('name', 'files[]')
    pNode.appendChild(node)
    // container.appendChild(document.createElement('BR'))

    node = document.createElement('DIV')
    node.setAttribute('id', nodeId + '-filenamearea')
    node.style.display = 'none'
    node.style.width = '100%'
    container.appendChild(node)
    pNode = node

    node = document.createElement('span')
    node.appendChild(document.createTextNode(INTERMediatorOnPage.getMessages()[3210]))
    node.style.color = 'gray'
    pNode.appendChild(node)
    // pNode.appendChild(document.createElement('BR'))
    node = document.createElement('span')
    node.setAttribute('id', nodeId + '-filename')
    node.style.width = '100%'
    pNode.appendChild(node)
    // pNode.appendChild(document.createElement('BR'))
    // pNode.appendChild(document.createTextNode(' '))
    // pNode.appendChild(document.createElement('BR'))

    node = document.createElement('SPAN')
    node.setAttribute('id', nodeId + '-uploadarea')
    node.style.display = 'none'
    node.style.marginTop = '20px'
    node.setAttribute('class', IMParts_Catalog.jquery_fileupload.sendButtonClasses)
    container.appendChild(node)
    pNode = node

    node = document.createElement('I')
    node.setAttribute('class', 'glyphicon')
    pNode.appendChild(node)
    node = document.createElement('SPAN')
    node.appendChild(document.createTextNode(INTERMediatorOnPage.getMessages()[3211]))
    pNode.appendChild(node)

    node = document.createElement('DIV')
    node.style.marginTop = '6px'
    node.style.display = 'none'
    node.setAttribute('class', 'progress')
    container.appendChild(node)
    pNode = node

    node = document.createElement('DIV')
    node.setAttribute('id', nodeId + '-progress')
    node.style.height = '18px'
    node.style.background = 'green'
    node.style.width = '0'
    pNode.appendChild(node)
    if (!this.isShowProgressBar) {
      node.style.display = 'none'
    }

    pNode = document.createElement('DIV')
    pNode.setAttribute('id', nodeId + '-previewarea')
    container.appendChild(pNode)

    node = document.createElement('IMG')
    node.setAttribute('id', nodeId + '-imagepreview')
    node.style.width = '100%'
    node.style.maxWidth = '100vw'
    pNode.appendChild(node)
    node.style.display = 'none'
    node = document.createElement('iframe')
    node.setAttribute('id', nodeId + '-iframepreview')
    node.style.width = '100%'
    node.style.maxWidth = '100vw'
    pNode.appendChild(node)
    node.style.display = 'none'
    node.style.border = 'none'

    targetNode._im_getComponentId = (function () {
      var theId = nodeId
      return function () {
        return theId
      }
    })()
    targetNode._im_setValue = (function () {
      var aNode = targetNode
      return function (str) {
        aNode.value = str
      }
    })()
    targetNode._im_getValue = (function () {
      var theId = nodeId
      return function () {
        if (IMParts_Catalog.jquery_fileupload.values[theId]) {
          return IMParts_Catalog.jquery_fileupload.values[theId]
        }
        return null
      }
    })()
  },

  ids: [],
  values: {},

  finish: function () {
    let shaObj, hmacValue, targetId, targetNode, cInfo, keyValue, i
    for (i = 0; i < this.ids.length; i++) {
      targetId = this.ids[i]
      cInfo = IMLibContextPool.getContextInfoFromId(targetId, '')
      targetNode = $('#' + targetId + '-fileupload')
      if (targetNode) {
        if (cInfo) { // The element is included in normal (not postonly) context.
          keyValue = cInfo.record.split('=')
          targetNode.fileupload({
            dataType: 'json',
            url: INTERMediatorOnPage.getEntryPath() + '?access=uploadfile',
            limitConcurrentUploads: 1,
            //formData: formData,
            add: (function () {
              let idValue = targetId
              return function (e, data) {
                if (IMParts_Catalog.jquery_fileupload.fileExtRequirements) {
                  let hasMatchExt = false
                  for (const ext of IMParts_Catalog.jquery_fileupload.fileExtRequirements) {
                    if (new RegExp(`\.(${ext})$`, 'i').test(data.files[0].name)) {
                      hasMatchExt = true
                    }
                  }
                  if (!hasMatchExt) {
                    return
                  }
                }
                $('#' + idValue + '-filename').text(data.files[0].name)
                $('#' + idValue + '-filenamearea').css('display', 'block')
                $('#' + idValue + '-uploadarea').css('display', 'inline-block')
                $('#' + idValue + '-uploadarea').click(function () {
                  data.submit()
                })
                const targetFile = data.files[0]
                let imageReader = new FileReader()
                imageReader.addEventListener('load', function () {
                  if (IMParts_Catalog.jquery_fileupload.isShowPreview) {
                    document.querySelector('#' + idValue + '-previewarea').style.display = 'block'
                    another = targetFile.type.indexOf('image') === 0 ? 'iframe' : 'image'
                    document.querySelector('#' + idValue + '-' + another + 'preview').style.display = 'none'
                    sign = targetFile.type.indexOf('image') === 0 ? 'image' : 'iframe'
                    previewNode = document.querySelector('#' + idValue + '-' + sign + 'preview')
                    previewNode.src = this.result
                    previewNode.style.display = 'inline'
                  }
                }, false)
                imageReader.readAsDataURL(targetFile)
              }
            })(),
            dropZone: $('#' + targetId),
            // drop: function (e) {
            //   e.preventDefault()
            //   console.log('###')
            // },
            submit: (function () {
              let idValue = targetId
              let cName = cInfo.context.contextName, cField = cInfo.field,
                keyField = keyValue[0], kv = keyValue[1]
              return function (e, data) {
                let fdata = []
                fdata.push({name: 'access', value: 'uploadfile'})
                fdata.push({name: '_im_contextnewrecord', value: 'uploadfile'})
                fdata.push({name: '_im_contextname', value: cName})
                fdata.push({name: '_im_field', value: cField})
                fdata.push({name: '_im_keyfield', value: keyField})
                fdata.push({name: '_im_keyvalue', value: kv})
                fdata.push({name: 'authuser', value: INTERMediatorOnPage.authUser()})
                if (INTERMediatorOnPage.authUser() && INTERMediatorOnPage.authUser().length > 0) {
                  fdata.push({name: 'clientid', value: INTERMediatorOnPage.clientId()})
                  if ((INTERMediatorOnPage.authHashedPassword()
                    || INTERMediatorOnPage.authHashedPassword2m()
                    || INTERMediatorOnPage.authHashedPassword2())
                    && INTERMediatorOnPage.authChallenge) {
                    if (INTERMediatorOnPage.passwordHash < 1.1 && INTERMediatorOnPage.authHashedPassword()) {
                      const shaObj = new jsSHA('SHA-256', 'TEXT')
                      shaObj.setHMACKey(INTERMediatorOnPage.authChallenge, 'TEXT')
                      shaObj.update(INTERMediatorOnPage.authHashedPassword())
                      const hmacValue = shaObj.getHMAC('HEX')
                      fdata.push({name: 'response', value: hmacValue})
                    }
                    if (INTERMediatorOnPage.passwordHash < 1.6 && INTERMediatorOnPage.authHashedPassword2m()) {
                      const shaObj = new jsSHA('SHA-256', 'TEXT')
                      shaObj.setHMACKey(INTERMediatorOnPage.authChallenge, 'TEXT')
                      shaObj.update(INTERMediatorOnPage.authHashedPassword2m())
                      const hmacValue = shaObj.getHMAC('HEX')
                      fdata.push({name: 'response2m', value: hmacValue})
                    }
                    if (INTERMediatorOnPage.passwordHash < 2.1 && INTERMediatorOnPage.authHashedPassword2()) {
                      const shaObj = new jsSHA('SHA-256', 'TEXT')
                      shaObj.setHMACKey(INTERMediatorOnPage.authChallenge, 'TEXT')
                      shaObj.update(INTERMediatorOnPage.authHashedPassword2())
                      const hmacValue = shaObj.getHMAC('HEX')
                      fdata.push({name: 'response2', value: hmacValue})
                    }
                  } else {
                    fdata.push({name: 'response', value: 'dummydummy'})
                  }
                  if (INTERMediatorOnPage.isNativeAuth || INTERMediatorOnPage.isLDAP) {
                    const encrypt = new JSEncrypt()
                    encrypt.setKey(INTERMediatorOnPage.publickey)
                    fdata.push({
                      name: 'cresponse',
                      value: encrypt.encrypt(
                        INTERMediatorOnPage.authCryptedPassword().substr(0, 220) +
                        IMLib.nl_char + INTERMediatorOnPage.authChallenge)
                    })
                  }
                }
                data.formData = fdata
                if (INTERMediatorOnPage.doBeforeValueChange) {
                  INTERMediatorOnPage.doBeforeValueChange(idValue)
                }
              }
            })(),
            done: (function () {
              let idValue = targetId
              let cName = cInfo.context.contextName
              let updateContext = targetNode[0].parentNode.parentNode.parentNode.getAttribute('data-im-update')
              updateContext = updateContext ? updateContext : cName
              return function (e, data) {
                let result = INTERMediator_DBAdapter.uploadFileAfterSucceed(
                  data.jqXHR,
                  function () {
                  },
                  function () {
                  },
                  true
                )
                if (INTERMediatorOnPage.doAfterValueChange) {
                  INTERMediatorOnPage.doAfterValueChange(idValue)
                }
                data.jqXHR.abort()
                if (result) {
                  INTERMediatorLog.flushMessage()
                  if (IMParts_Catalog.jquery_fileupload.fullUpdate) {
                    INTERMediator.construct()
                  } else if (updateContext) {
                    INTERMediator.construct(IMLibContextPool.contextFromName(updateContext))
                  } else {
                    INTERMediator.construct(IMLibContextPool.contextFromName(cName))
                  }
                }
              }
            })(),
            fail: function (e, data) {
              window.alert(data.jqXHR.responseText)
              data.jqXHR.abort()
            },
            progressall: (function () {
              let idValue = targetId
              return function (e, data) {
                let progress = parseInt(data.loaded / data.total * 100, 10)
                $('#' + idValue + '-progress').css('width', progress + '%')
              }
            })()
          })
        } else { // For postonly mode.
          if (targetNode) {
            $('#' + targetId + '-progress').parent().css('display', 'none')
            $('#' + targetId + '-previewarea').css('display', 'none')
            targetNode.fileupload({
              dataType: 'json',
              // url: INTERMediatorOnPage.getEntryPath() + '?access=uploadfile',
              limitConcurrentUploads: 1,
              add: (function () {
                let idValue = targetId
                return function (e, data) {
                  let targetFile = data.files[0], sign, another, previewNode
                  if (IMParts_Catalog.jquery_fileupload.fileExtRequirements) {
                    let hasMatchExt = false
                    for (const ext of IMParts_Catalog.jquery_fileupload.fileExtRequirements) {
                      if (new RegExp(`\.(${ext})$`, 'i').test(targetFile.name)) {
                        hasMatchExt = true
                      }
                    }
                    if (!hasMatchExt) {
                      return
                    }
                  }
                  $('#' + idValue + '-filenamearea').css('display', 'block')
                  if (!Array.isArray(IMParts_Catalog.jquery_fileupload.values[idValue])) {
                    const fnStr = $('#' + idValue + '-filename').text()
                    if (fnStr) {
                      $('#' + idValue + '-filename').text(`${fnStr}, ${targetFile.name}`)
                    } else {
                      $('#' + idValue + '-filename').text(targetFile.name)
                    }
                  } else {
                    $('#' + idValue + '-filename').text(targetFile.name)
                  }
                  let imageReader = new FileReader()
                  imageReader.addEventListener('load', function () {
                    if (IMParts_Catalog.jquery_fileupload.isShowPreview) {
                      document.querySelector('#' + idValue + '-previewarea').style.display = 'block'
                      another = targetFile.type.indexOf('image') === 0 ? 'iframe' : 'image'
                      document.querySelector('#' + idValue + '-' + another + 'preview').style.display = 'none'
                      sign = targetFile.type.indexOf('image') === 0 ? 'image' : 'iframe'
                      previewNode = document.querySelector('#' + idValue + '-' + sign + 'preview')
                      previewNode.src = this.result
                      previewNode.style.display = 'inline'
                    }
                    if (IMParts_Catalog.jquery_fileupload.multiFileInPostOnly) {
                      if (!Array.isArray(IMParts_Catalog.jquery_fileupload.values[idValue])) {
                        IMParts_Catalog.jquery_fileupload.values[idValue] = []
                      }
                      IMParts_Catalog.jquery_fileupload.values[idValue].push({
                        file: targetFile,
                        kind: 'attached'
                      })
                    } else {
                      IMParts_Catalog.jquery_fileupload.values[idValue] = {
                        file: targetFile,
                        kind: 'attached'
                      }
                    }
                  }, false)
                  imageReader.readAsDataURL(targetFile)
                }
              })(),
              dropZone: $('#' + targetId),
              // drop: function (e) {
              //   e.preventDefault()
              //   console.log('###')
              // }
            })
          }
        }
      }
    }
    this.ids = []
  }
}
