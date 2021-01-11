import { Modal } from 'antd';
import {
  CSSProperties,
  memo,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import {
  boardActions,
  boardThunks,
  selectCreateBoardDialogVisible,
  selectStandbyBoardBgColors,
  selectStandbyBoardBgImages,
  useReduxDispatch,
  useReduxSelector,
} from '../../redux';
import styles from '../../styles/CreateBoardDialog.module.scss';
import { preloadImage } from '../../utils';
import { ISelectedBackground } from './BackgroundPopover';
import BoardForm from './BoardForm';

export interface ICreateBoardDialogProps {
  defaultGroupId?: string;
}

function CreateBoardDialog(props: ICreateBoardDialogProps) {
  const dispatch = useReduxDispatch();
  const visible = useReduxSelector(selectCreateBoardDialogVisible);
  const colors = useReduxSelector(selectStandbyBoardBgColors);
  const images = useReduxSelector(selectStandbyBoardBgImages);
  const [background, setBackground] = useState<ISelectedBackground>({});

  const handleClose = () => {
    dispatch(boardActions.setCreateDialogVisible(false));
  };

  const handleFinish = () => {
    handleClose();
    dispatch(boardThunks.fetchBgImages());
  };

  // NOTE: preload images
  useEffect(() => {
    const image = images[0];
    if (image) {
      preloadImage(image.urls.small);
    }
  }, [images]);

  useLayoutEffect(() => {
    setBackground({
      image: images[0],
      color: colors[0],
    });
  }, [images, colors]);

  const bodyStyle: CSSProperties = {};
  if (background.image) {
    bodyStyle.backgroundImage = `url(${background.image.urls.small})`;
    bodyStyle.backgroundColor = background.image.color;
  } else if (background.color) {
    bodyStyle.backgroundColor = background.color;
  }

  return (
    <Modal
      className={styles.wrapper}
      maskClosable={false}
      footer={null}
      visible={visible}
      centered={true}
      onCancel={handleClose}
      bodyStyle={bodyStyle}>
      <div className={styles.body}>
        <BoardForm
          background={background}
          onBackgroundChange={setBackground}
          onFinish={handleFinish}
        />
      </div>
    </Modal>
  );
}

export default memo(CreateBoardDialog);
