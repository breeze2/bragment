import Modal from 'antd/lib/modal/Modal';
import { memo } from 'react';

import { ECardType } from '../../api/types';
import {
  cardActions,
  selectCreateCardAsType,
  selectCreateCardDialogVisible,
  selectCreateCardForColumn,
  selectCurrentColumnList,
  useReduxDispatch,
  useReduxSelector,
} from '../../redux';
import GistForm from './GistForm';
import styles from './index.module.scss';

function CreateCardDialog() {
  const dispatch = useReduxDispatch();
  const columnList = useReduxSelector(selectCurrentColumnList);
  const createForColumn = useReduxSelector(selectCreateCardForColumn);
  const createAsType = useReduxSelector(selectCreateCardAsType);
  const visible = useReduxSelector(selectCreateCardDialogVisible);
  const close = () => {
    dispatch(cardActions.hideCreateDialog());
  };
  const handleColumnChange = (columnId: string) => {
    dispatch(cardActions.setCreateForColumnId(columnId));
  };

  const renderCreateForm = (type: ECardType) => {
    switch (type) {
      case ECardType.GIST:
        return (
          <GistForm
            columnList={columnList}
            selectedColumn={createForColumn}
            onColumnChange={handleColumnChange}
            onFinish={close}
          />
        );
      default:
        return (
          <GistForm
            columnList={columnList}
            selectedColumn={createForColumn}
            onColumnChange={handleColumnChange}
            onFinish={close}
          />
        );
    }
  };

  return (
    <Modal
      className={styles.wrapper}
      title={null}
      footer={null}
      width={540}
      visible={visible}
      centered={true}
      onCancel={close}>
      <div className={styles.body}>{renderCreateForm(createAsType)}</div>
    </Modal>
  );
}

export default memo(CreateCardDialog);
