"use client";
import NewsPage from "@/components/page/private/content_manager/NewsPage";
import useApi from "@/hooks/useApi";
import useAppNameSpace from "@/hooks/useAppNameSpace";
import { TMode } from "@/types/app";
import { CreateNewsRequest } from "@/types/service";
import { useState } from "react";

const CREATE_EMPTY: CreateNewsRequest = {
  content: "",
  title: "",
  slug: "",
  status: "draft",
  thumbnailUrl: "",
};

const NewsContainer = () => {
  const api = useApi();
  const ns = useAppNameSpace();

  const useCreateNews = api.content.mutate.createNews();
  const useUpdateNews = api.content.mutate.updateNews();
  const useNewsData = api.content.query.cmsNews({ limit: 100 });
  const { data: NewsData, isLoading } = useNewsData;

  console.log(NewsData, ":Datas");

  const [formCreateNews, setFormCreateNews] =
    useState<CreateNewsRequest>(CREATE_EMPTY);
  const [openPopUp, setOpenPopUp] = useState<boolean>(false);

  const [mode, setMode] = useState<TMode>("create");
  const onOpenDialogChange = (open: boolean) => {
    if (open) {
      setMode("create");
      setFormCreateNews(CREATE_EMPTY);
    }
    setOpenPopUp(open);
  };

  const handleNewsFormChange = <K extends keyof CreateNewsRequest>(
    field: K,
    value: CreateNewsRequest[K],
  ) => {
    setFormCreateNews((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitNews = async () => {
    if (
      !formCreateNews.content ||
      !formCreateNews.title ||
      !formCreateNews.slug ||
      !formCreateNews.status ||
      !formCreateNews.thumbnailUrl
    ) {
      return ns.alert.toast({
        title: "Pesan",
        message: "Judul, Content, Slug, Status tidak boleh kosong",
        icon: "info",
      });
    }

    try {
      if (mode === "create") {
        await useCreateNews.mutateAsync(formCreateNews);
        setOpenPopUp(false);
        setFormCreateNews(CREATE_EMPTY);
      } else {
        if (!formCreateNews.id) {
          return ns.alert.toast({
            title: "Pesan",
            message: "Kamu Tidak Memiliki ID",
            icon: "info",
          });
        }

        await useUpdateNews.mutateAsync({
          id: formCreateNews.id,
          body: {
            content: formCreateNews.content,
            slug: formCreateNews.slug,
            status: formCreateNews.status,
            thumbnailUrl: formCreateNews.thumbnailUrl,
            title: formCreateNews.title,
          },
        });

        setOpenPopUp(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <NewsPage
      onOpenDialogChange={onOpenDialogChange}
      mode={mode}
      handleSubmit={handleSubmitNews}
      open={openPopUp}
      form={formCreateNews}
      onNewsFormChange={handleNewsFormChange}
      setMode={setMode}
    />
  );
};

export default NewsContainer;
