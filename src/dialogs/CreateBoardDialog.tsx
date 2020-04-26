import {
  GlobalOutlined,
  LockOutlined,
  PictureOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Input, Modal, Select } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import {
  EBoardPolicy,
  EBoardType,
  IBoard,
  IPartial,
  IUnsplashPhoto,
} from '../api/types';
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
import { preloadImage } from '../utils';

import styles from '../styles/CreateBoardDialog.module.scss';

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

const CreateBoardDialog: React.FC<ICreateBoardDialogProps> = React.memo(
  (props) => {
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

    const defaultBackground: ISelectedBackground = {};
    if (images.size > 0) {
      defaultBackground.image = images.get(0);
    } else if (colors.size > 0) {
      defaultBackground.color = colors.get(0);
    }
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
    const hanleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
      setState({ canCreate: !!event.target.value.trim() });
    const handleTypeChange = (value: string) => setState({ type: value });
    const handlePolicyChange = (value: string) =>
      setState({ policy: value as EBoardPolicy });
    const handleBgSelectChange = (value: ISelectedBackground) =>
      setState(value);
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
              onChange={hanleTitleChange}
              placeholder={f({ id: 'addBoardTitle' })}
              addonAfter={
                <BoardBackgroundPopover
                  defaultValue={defaultBackground}
                  onChange={handleBgSelectChange}>
                  <div className={styles.bgSelect}>
                    <PictureOutlined />
                  </div>
                </BoardBackgroundPopover>
              }
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
);

export default CreateBoardDialog;
