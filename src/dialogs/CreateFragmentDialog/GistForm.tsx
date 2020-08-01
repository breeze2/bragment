import React, { memo, Suspense } from 'react';
import GistCodeEditorSkeleton from '../../skeletons/GistCodeEditorSkeleton';

const GistCodeEditor = React.lazy(() =>
  import('../../components/GistCodeEditor')
);

function CreateFragmentDialog() {
  return (
    <Suspense fallback={<GistCodeEditorSkeleton />}>
      <GistCodeEditor />
    </Suspense>
  );
}

export default memo(CreateFragmentDialog);
