import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { 
  DialogContent, 
  Dialog, 
  DialogTitle, 
  TextField, 
  Button, 
  IconButton, 
} from '@material-ui/core';

// icon
import ClearIcon from '@mui/icons-material/Clear';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

// useContext
import { PostContext } from "App";

//atoms
import { SubmitButton } from 'components/atoms/Button/SubmitButton';

// organisms
import { AlertMessage } from 'components/organisms/Alert/AlertMessage';

// hooks
import { UseCreatePost } from 'hooks/useCreatePost';

interface Props {
  isOpen: boolean,
  onClose: () => void,
}

const DialogInner = styled(DialogContent)`
  padding-bottom: 20px;
`
const ButtonWrapper = styled.div`
  width: 100%;
  bottom: 10px;
`

const ImageWapper = styled.div`
  padding: 15px;
  height: 80px;
  display: flex;
`
const ImagesArea = styled.div`
  width: 100%;
  padding: 0 10px;
  display: flex;
`
const ImagesBox = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  border: 1px solid #f3f3f3;
`
const Image = styled.img`
  object-fit: contain;
  position: absolute;
  width: 100%;
  height: 100%;
  margin: 0;
`
const CloseButton = styled(IconButton)`
  top: -15px;
  left: -10px;
  color: #aaa;
`

export const PostModal = (props: Props) => {

  const history = useHistory();

  const { setIsPosted } = useContext(PostContext)

  const [caption, setCaption] = useState<string>("")
  const [images, setImages] = useState<File[]>([]);
  const maxImagesUpload = 3;
  const inputId = Math.random().toString(32).substring(2);

  // アラート
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false)

  // 写真追加
  const handleOnAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const img: File = e.target.files[0];
    setImages([...images, img]);
  };

  // 写真削除
  const handleOnRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  // 投稿
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    UseCreatePost({caption, images})
    .then((res) => {
      props.onClose();
      setImages([])
      setCaption("")
      history.push("/")
      setIsPosted(true)
      setAlertMessageOpen(true)
    })
  }


  return (
    <>
      <Dialog
        open={props.isOpen}
        onClose={props.onClose}
        fullWidth
      >
        <DialogTitle>写真を投稿する</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogInner>
            <TextField
            rows={4}
            variant="outlined"
            fullWidth
            label="キャプション"
            multiline
            placeholder='キャプションを入力...'
            onChange={e => setCaption(e.target.value)}
          />

            <ImageWapper>
              <label 
                htmlFor={inputId}>
                <Button
                  variant="contained"
                  disabled={images.length >= maxImagesUpload}
                  component="span"
                >
                  +
                </Button>
                <input
                  required
                  id={inputId}
                  type="file"
                  multiple
                  accept="image/*,.png,.jpg,.jpeg,.gif"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOnAddImage(e)}
                  disabled={images.length >= maxImagesUpload}
                  style={{display: "none"}}
                />
              </label>
              <ImagesArea>
                {images.map((image, i) => (
                  <ImagesBox key={i} >
                    <Image src={URL.createObjectURL(image)}/>
                    <CloseButton
                      onClick={() => handleOnRemoveImage(i)}>
                      <ClearIcon/>
                    </CloseButton>
                  </ImagesBox>
                ))}
              </ImagesArea>
            </ImageWapper>

            <ButtonWrapper>
              <SubmitButton>送信</SubmitButton>
            </ButtonWrapper>
          </DialogInner>
        </form>
      </Dialog>

      <AlertMessage
        open={alertMessageOpen}
        setOpen={setAlertMessageOpen}
        severity="success"
        message="投稿が完了しました"
      />
    </>
  )
}