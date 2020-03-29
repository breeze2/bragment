import { EditOutlined, FolderOutlined } from '@ant-design/icons';
import { Button, Input, Modal } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { openDirectoryDialog } from '../../api/electron';
import { EBoardType, IBoard } from '../../api/types';
import {
  asyncCreateBoard,
  asyncDispatch,
  setCreateBoardDialogVisible,
} from '../../redux/actions';
import { IReduxState } from '../../redux/types';
import { getPathBasename, preloadImage } from '../../utils';
import BoardBackgroundPopover, {
  ISelectedBackground,
} from '../BoardBackgroundPopover';

import styles from '../../styles/BoardDialog.module.scss';

const CreateBoardCard: React.FC = React.memo(() => {
  const { formatMessage: f } = useIntl();
  const dispatch = useDispatch();
  const visible = useSelector(
    (state: IReduxState) => state.board.createDialogVisible
  );
  const images = useSelector(
    (state: IReduxState) => state.board.standbyBgImages
  );
  const colors = useSelector(
    (state: IReduxState) => state.board.standbyBgColors
  );
  // NOTE: preload images
  React.useEffect(() => {
    images.forEach((image) => {
      preloadImage(image.urls.small);
      preloadImage(image.urls.thumb);
    });
  }, [images]);

  const defaultBackground: ISelectedBackground = {};
  if (images.size > 0) {
    defaultBackground.image = images.get(0);
  } else if (colors.size > 0) {
    defaultBackground.color = colors.get(0);
  }
  const [isCreating, setIsCreating] = React.useState(false);
  const [path, setPath] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [background, setBackground] = React.useState<ISelectedBackground>({});

  const realBackground =
    background.color || background.image ? background : defaultBackground;
  const style: React.CSSProperties = {};
  if (realBackground.color) {
    style.backgroundColor = realBackground.color;
  } else if (realBackground.image) {
    style.backgroundColor = realBackground.image.color;
    style.backgroundImage = `url(${realBackground.image.urls.small})`;
  }

  const handleClose = () => dispatch(setCreateBoardDialogVisible(false));
  const hanleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(event.target.value);
  const handleBgSelectChange = (value: ISelectedBackground) => {
    setBackground(value);
  };
  const handlePathSelect = () => {
    const result = openDirectoryDialog();
    if (result && result[0]) {
      const dir = result[0];
      const basename = getPathBasename(dir);
      if (title.trim() === '') {
        setTitle(basename);
      } else {
        // TODO: complete path
      }
      setPath(dir);
    }
  };
  const handleCreate = () => {
    const now = Date.now();
    const newBoard: IBoard = {
      color: '',
      image: '',
      path,
      title: title.trim(),
      archived: false,
      type: EBoardType.PERSON,
      checked_at: now,
      created_at: now,
      updated_at: now,
    };
    if (realBackground.image) {
      newBoard.color = realBackground.image.color;
      newBoard.image = realBackground.image.urls.regular;
    } else if (realBackground.color) {
      newBoard.color = realBackground.color;
    }
    setIsCreating(true);
    asyncDispatch(dispatch, asyncCreateBoard(newBoard))
      .then(() => {
        handleClose();
        setTitle('');
        setPath('');
      })
      .catch(() => {
        // TODO: alert error message
      })
      .finally(() => {
        setIsCreating(false);
      });
  };

  return (
    <Modal
      className={styles.wrapper}
      maskClosable={false}
      footer={null}
      visible={visible}
      onCancel={handleClose}
      bodyStyle={style}>
      <div className={styles.body}>
        <div className={styles.field}>
          <Input
            value={title}
            onChange={hanleTitleChange}
            placeholder={f({ id: 'addBoardTitle' })}
            addonAfter={
              <BoardBackgroundPopover
                defaultValue={defaultBackground}
                onChange={handleBgSelectChange}>
                <div className={styles.bgSelect}>
                  <EditOutlined />
                </div>
              </BoardBackgroundPopover>
            }
          />
        </div>
        <div className={styles.field} onClick={handlePathSelect}>
          <Input
            value={path}
            disabled
            placeholder={f({ id: 'selectLocalPath' })}
            addonAfter={<FolderOutlined />}
          />
        </div>
        <div>
          <Button
            type="primary"
            onClick={handleCreate}
            disabled={!path || !title.trim()}
            loading={isCreating}>
            {f({ id: 'createBoard' })}
          </Button>
        </div>
      </div>
    </Modal>
  );
});

export default CreateBoardCard;
