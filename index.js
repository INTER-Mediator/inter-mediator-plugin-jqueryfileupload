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
  panelWidth: '300px',
  fullUpdate: true,
  isShowProgressBar: true,
  isShowPreview: true,

  instanciate: function (targetNode) {
    let container, node, nodeId, pNode = targetNode
    nodeId = targetNode.getAttribute('id')
    this.ids.push(nodeId)

    container = document.createElement('DIV')
    container.setAttribute('class', 'jquery-fileupload-container')
    container.style.width = this.panelWidth
    pNode.appendChild(container)

    node = document.createElement('SPAN')
    node.setAttribute('class', 'btn btn-success fileinput-button')
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

    node = document.createElement('DIV')
    node.setAttribute('id', nodeId + '-uploadarea')
    node.style.display = 'none'
    node.style.marginTop = '20px'
    node.setAttribute('class', 'btn btn-primary')
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
    node.setAttribute('id', nodeId + '-preview')
    node.style.width = '100%'
    node.style.maxWidth = '100vw'
    pNode.appendChild(node)
    if (!this.isShowPreview) {
      node.style.display = 'none'
    }

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
                $('#' + idValue + '-filename').text(data.files[0].name)
                $('#' + idValue + '-filenamearea').css('display', 'inline')
                $('#' + idValue + '-uploadarea').css('display', 'inline')
                $('#' + idValue + '-uploadarea').click(function () {
                  data.submit()
                })
              }
            })(),
            submit: (function () {
              let cName = cInfo.context.contextName, cField = cInfo.field,
                  keyField = keyValue[0], kv = keyValue[1], encrypt = new JSEncrypt()
              encrypt.setPublicKey(INTERMediatorOnPage.publickey)
              return function (e, data) {
                let fdata = []
                let encrypt = new JSEncrypt()
                encrypt.setKey(INTERMediatorOnPage.publickey)

                fdata.push({name: 'access', value: 'uploadfile'})
                fdata.push({name: '_im_contextnewrecord', value: 'uploadfile'})
                fdata.push({name: '_im_contextname', value: cName})
                fdata.push({name: '_im_field', value: cField})
                fdata.push({name: '_im_keyfield', value: keyField})
                fdata.push({name: '_im_keyvalue', value: kv})
                fdata.push({name: 'authuser', value: INTERMediatorOnPage.authUser})
                if (INTERMediatorOnPage.authUser.length > 0) {
                  fdata.push({name: 'clientid', value: INTERMediatorOnPage.clientId})
                  if (INTERMediatorOnPage.authHashedPassword && INTERMediatorOnPage.authChallenge) {
                    shaObj = new jsSHA('SHA-256', 'TEXT')
                    shaObj.setHMACKey(INTERMediatorOnPage.authChallenge, 'TEXT')
                    shaObj.update(INTERMediatorOnPage.authHashedPassword)
                    hmacValue = shaObj.getHMAC('HEX')
                    fdata.push({name: 'response', value: hmacValue})
                  } else {
                    fdata.push({name: 'response', value: 'dummydummy'})
                  }
                  fdata.push({
                    name: 'cresponse',
                    value: encrypt.encrypt(
                        INTERMediatorOnPage.authCryptedPassword.substr(0, 220) +
                        IMLib.nl_char + INTERMediatorOnPage.authChallenge)
                  })
                }
                data.formData = fdata
              }
            })(),
            done: (function () {
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
              url: INTERMediatorOnPage.getEntryPath() + '?access=uploadfile',
              limitConcurrentUploads: 1,
              //formData: formData,
              add: (function () {
                let idValue = targetId
                return function (e, data) {
                  let targetFile = data.files[0]
                  $('#' + idValue + '-filename').text(targetFile.name)
                  $('#' + idValue + '-filenamearea').css('display', 'block')
                  let imageReader = new FileReader()
                  imageReader.addEventListener('load', function () {
                    document.querySelector('#' + idValue + '-previewarea').style.display = 'block'
                    document.querySelector('#' + idValue + '-preview').src = this.result
                  }, false)
                  imageReader.readAsDataURL(targetFile)
                  let fileReader = new FileReader()
                  fileReader.addEventListener('load', function () {
                    IMParts_Catalog.jquery_fileupload.values[idValue] = {name: targetFile.name, content: this.result}
                  }, false)
                  fileReader.readAsArrayBuffer(targetFile)
                }
              })()
            })
          }
        }
      }
    }
    this.ids = []
  }
}
