import {
  useCreateMaterial,
  useCreateModule,
  useDeleteMaterial,
  useDeleteModule,
  useMarkMaterialProgress,
  useUpdateMaterial,
  useUpdateMaterialStatus,
  useUpdateModule,
  useUpdateModuleStatus,
} from './state/mutate';
import {
  useMaterialActivities,
  useMaterialDetail,
  useMaterialList,
  useModuleDetail,
  useModuleLabelList,
  useModuleList,
  useModuleProgress,
  useMyLearningProgress,
} from './state/query';

export const useLearning = () => {
  return {
    query: {
      modules: useModuleList,
      moduleLabels: useModuleLabelList,
      moduleDetail: useModuleDetail,
      moduleProgress: useModuleProgress,
      materials: useMaterialList,
      materialDetail: useMaterialDetail,
      materialActivities: useMaterialActivities,
      myProgress: useMyLearningProgress,
    },
    mutate: {
      createModule: useCreateModule,
      updateModule: useUpdateModule,
      updateModuleStatus: useUpdateModuleStatus,
      deleteModule: useDeleteModule,
      createMaterial: useCreateMaterial,
      updateMaterial: useUpdateMaterial,
      updateMaterialStatus: useUpdateMaterialStatus,
      deleteMaterial: useDeleteMaterial,
      markProgress: useMarkMaterialProgress,
    },
  };
};

export default useLearning;
