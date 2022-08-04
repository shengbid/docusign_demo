import React, {useState, useEffect} from 'react'
import { sendRequest } from '../api/apiHelper';

const Modal = (props) => {
  const [fileList, setFileList] = useState([])
  const [imgList, setImgList] = useState([])
  const {visible, envelopeId, handleCancel} = props

  // 获取文件列表
  const getList = async () => {
    try {
      const {data} = await sendRequest('/template/getEnvelopeDocuments', {envelopeId});
      setFileList(data)

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (visible) {
      getList()
    }
  }, [visible])

  const onCancel = () => {
    handleCancel()
  }

  // 查看文件图片
  const viewImage = async(recored) => {

    try {
      let pages = recored.pages ? recored.pages : [{sequence: '1'}]
      const arr = []
      for (const item of pages) {
        const { data } = await sendRequest('/template/getEnvelopeDocumentImages',{
          envelopeId,
          documentId: recored.documentId,
          pageNumber: item.sequence,
        })
        arr.push(`data:image/png;base64, ${data}`)
      }
      setImgList(arr)

    } catch (error) {
      console.log(error);
    }
  }

  return (
    visible ? <div className='modal-contanier'>
      <div className='modal-wrap'>
        <div className='modal-box'>
          <div className='header'>
            <div className='title'>合同文件</div>
            <div className='close' onClick={onCancel}>x</div>
          </div>
          <div className='content'>
            {fileList.length && fileList.map(item => 
              <div className='file' key={item.documentId} onClick={() => viewImage(item)}>{item.name}</div>
            )}
            <div className='imgList'>
              {imgList.length && imgList.map(item => 
                <div className='img' key={Math.random()}>
                  <img src={item} alt='' />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div> : <></>
  )
}

export default Modal