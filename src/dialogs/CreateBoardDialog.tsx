import {
  GlobalOutlined,
  LockOutlined,
  PictureOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Input, Modal, Select } from 'antd';
import React, { memo, useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { EBoardPolicy, EBoardType, IBoard, IUnsplashPhoto } from '../api/types';
import BoardBackgroundPopover, {
  ISelectedBackground,
} from '../components/BoardBackgroundPopover';
import { useMultipleState } from '../components/hooks';
import {
  asyncCreateBoard,
  asyncDispatch,
  setCreateBoardDialogVisible,
} from '../redux/actions';
import { IReduxState } from '../redux/types';
import styles from '../styles/CreateBoardDialog.module.scss';
import { IPartial } from '../types';
import { preloadImage } from '../utils';

export interface ICreateBoardDialogProps {
  defaultPolicy?: EBoardPolicy;
  defaultType?: EBoardType;
  defaultGroup?: string;
}

interface ICreateBoardDialogState {
  image?: IUnsplashPhoto;
  color?: string;
  type: string;
  policy: EBoardPolicy;
  canCreate: boolean;
  isCreating: boolean;
}

const { Option } = Select;

function CreateBoardDialog(props: ICreateBoardDialogProps) {
  const { formatMessage: f } = useIntl();
  const dispatch = useDispatch();
  const titleRef = React.useRef<Input>(null);
  const visible = useSelector(
    (reduxState: IReduxState) => reduxState.board.createDialogVisible
  );
  const images = useSelector(
    (reduxState: IReduxState) => reduxState.board.standbyBgImages
  );
  const colors = useSelector(
    (reduxState: IReduxState) => reduxState.board.standbyBgColors
  );

  const defaultBackground = useMemo(() => {
    const background: ISelectedBackground = {};
    if (images.size > 0) {
      background.image = images.get(0);
    } else if (colors.size > 0) {
      background.color = colors.get(0);
    }
    return background;
  }, [colors, images]);
  const defaultTitle = '';
  const defaultImage = images.get(0);
  const defaultColor = colors.get(0);
  const defaultPolicy = props.defaultPolicy || EBoardPolicy.PRIVATE;
  const defaultType =
    props.defaultType === EBoardType.GROUP
      ? `${EBoardType.GROUP}:${props.defaultGroup}`
      : EBoardType.PERSONAL;
  const defaultState = {
    color: defaultColor,
    image: defaultImage,
    type: defaultType,
    policy: defaultPolicy,
    isCreating: false,
    canCreate: false,
  };
  const [state, setState] = useMultipleState<ICreateBoardDialogState>(
    defaultState
  );
  const style: React.CSSProperties = {};
  if (state.image) {
    style.backgroundImage = `url(${state.image.urls.small})`;
    style.backgroundColor = state.image.color;
  } else if (state.color) {
    style.backgroundColor = state.color;
  }

  const handleClose = () => dispatch(setCreateBoardDialogVisible(false));
  const handleTitleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setState({ canCreate: !!event.target.value.trim() }),
    [setState]
  );
  const handleTypeChange = useCallback(
    (value: string) => setState({ type: value }),
    [setState]
  );
  const handlePolicyChange = useCallback(
    (value: string) => setState({ policy: value as EBoardPolicy }),
    [setState]
  );
  const handleBgSelectChange = useCallback(
    (value: ISelectedBackground) => setState(value),
    [setState]
  );
  const handleCreate = () => {
    const title = titleRef.current?.state.value;
    const options: IPartial<IBoard> = {
      title,
      type: EBoardType.PERSONAL,
      policy: state.policy,
    };
    if (state.image) {
      options.color = state.image.color;
      options.image = state.image.urls.raw;
      preloadImage(options.image);
    } else if (state.color) {
      options.color = state.color;
    }
    setState({ isCreating: true });
    asyncDispatch(dispatch, asyncCreateBoard(options))
      .then(() => {
        handleClose();
        titleRef.current?.setValue(defaultTitle);
        setState(defaultState);
      })
      .catch(() => {
        // TODO: alert error message
      })
      .finally(() => {
        setState({ isCreating: false });
      });
  };

  const boardBackgroundPopover = useMemo(
    () => (
      <BoardBackgroundPopover
        defaultValue={defaultBackground}
        onChange={handleBgSelectChange}>
        <div className={styles.bgSelect}>
          <PictureOutlined />
        </div>
      </BoardBackgroundPopover>
    ),
    [defaultBackground, handleBgSelectChange]
  );

  // NOTE: preload images
  React.useEffect(() => {
    const image = images.get(0);
    if (image) {
      preloadImage(image.urls.small);
    }
    setState({ image });
  }, [images, setState]);

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
            ref={titleRef}
            defaultValue={defaultTitle}
            onChange={handleTitleChange}
            placeholder={f({ id: 'addBoardTitle' })}
            addonAfter={boardBackgroundPopover}
          />
        </div>
        <div className={styles.field}>
          <Select
            dropdownClassName={styles.dropdown}
            defaultValue={defaultType}
            onChange={handleTypeChange}>
            <Option value={EBoardType.PERSONAL}>
              <UserOutlined />
              {f({ id: 'personal' })}
            </Option>
            <Option value="disabled" disabled>
              <TeamOutlined />
              {f({ id: 'noGroups' })}
            </Option>
          </Select>
        </div>
        <div className={styles.field}>
          <Select
            dropdownClassName={styles.dropdown}
            defaultValue={defaultPolicy}
            onChange={handlePolicyChange}>
            <Option value={EBoardPolicy.PRIVATE}>
              <LockOutlined />
              {f({ id: 'private' })}
            </Option>
            <Option value={EBoardPolicy.PUBLIC}>
              <GlobalOutlined />
              {f({ id: 'public' })}
            </Option>
          </Select>
        </div>
        <div className={styles.action}>
          <Button
            type="primary"
            onClick={handleCreate}
            disabled={!state.canCreate}
            loading={state.isCreating}>
            {f({ id: 'createBoard' })}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default memo(CreateBoardDialog);
