'use client';

import ItemGallery from '@/components/item-gallery/ItemGallery';
import { getMachine } from '@/shared/storage';
import { Characteristic, DataItem, GalleryItem } from '@/types/types';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import TitleMachine from './ui/title-machine/TitleMachine';
import TableHaracteristics from '@/components/table-haracteristics/TableHaracteristics';
import Breadcrumb from './ui/bread-crumb/Breadcrumb';
import PriceMachine from './ui/price-machine/PriceMachine';
import EditableCharacteristics from './ui/characteristics/EditableCharacteristics';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { updateMachine } from '@/store/slice/dataSlice';
import { AppDispatch } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { selectEditor, setEditor } from '@/store/slice/adminSlice';
import CustomizedSnackbars from './ui/custom-snackbar/CustomSnackbar';
import ArticleMachine from './ui/article-machine/ArticleMachine';
import DescriptionMachine from './ui/description-machine/DescriptionMachine';
import Loader from './ui/loader/Loader';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import ApiClient, { Type } from '@/store/slice/db';
import { EMPTY_DATA_ITEM } from '@/constants/dataConstants';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const api = new ApiClient('https://machines.qpart.com.ua/');

const MachinePage = () => {
  const [machine, setMachine] = useState<DataItem>(EMPTY_DATA_ITEM);
  const dispatch: AppDispatch = useDispatch();
  const editor = useSelector(selectEditor);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');
  const pathName = usePathname();
  const [types, setTypes] = useState<Type[]>([]);
  const [currenTypeName, setCurrentTypeName] = useState<string>('');

  if (!id) {
    router.push('/');
  }

  useEffect(() => {
    if (machine.data.type.length > 0) {
      if (types.length > 0) {
        const currentType = types.filter((item) => item.id === machine.data.type)[0] || { name: '' };
        setCurrentTypeName(currentType.name);
      }
    }
  }, [types, machine]);

  useEffect(() => {
    api
      .getTypes()
      .then((res) => setTypes(res))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const fetchMachine = async () => {
      if (id) {
        try {
          setMachine(await getMachine(id)); // Сохраняем результат в состояние
        } catch (error) {
          console.error('Error fetching machine:', error);
          router.push('/');
        }
      }
    };

    fetchMachine();
  }, []);

  useEffect(() => {
    const urlToFile = async (url: string, filename: string, mimeType: string): Promise<File> => {
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      return new File([buffer], filename, { type: mimeType });
    };

    const fetchFiles = async () => {
      if (!editor) {
        return;
      }
      const fetchedFiles = await Promise.all(
        machine?.data.gallery.map((item) => urlToFile(item.src, item.name, item.type))
      );

      setFiles(fetchedFiles);
    };

    if (pathName.search('machine') !== -1) {
      if (editor) {
        fetchFiles();
      }
    }
  }, [editor, machine]);

  const handleTitleChange = (value: string) => {
    setMachine({
      ...machine!,
      data: { ...machine!.data, name: value },
    });
  };

  const handlePriceChange = (value: string) => {
    setMachine({
      ...machine!,
      data: { ...machine!.data, price: value },
    });
  };

  const handleArticle = (value: string) => {
    setMachine({
      ...machine!,
      data: { ...machine!.data, article: value },
    });
  };

  const handleMainPhoto = (value: string) => {
    setMachine((prevMachine) => {
      const currentMainImage = prevMachine?.data.mainImage || '';
      return {
        ...prevMachine!,
        data: {
          ...prevMachine!.data,
          mainImage: currentMainImage === value ? '' : value, // Сбрасываем, если совпадает
        },
      };
    });
  };

  const handleTypeAndModel = (key: string, value: string) => {
    setMachine({
      ...machine!,
      data: { ...machine!.data, [key]: value },
    });
  };

  const handleTypeChange = (val: string) => {
    const currentItem = types.filter((item) => item.id === val)[0] || { characteristics: [], name: '' };

    setCurrentTypeName(currentItem.name);

    const characteristics: Characteristic[] = [];
    if (currentItem.characteristics === null) {
      currentItem.characteristics = [];
    }
    currentItem.characteristics.forEach((item) => {
      const characteristic: Characteristic = { name: item, value: '', viewInCard: false };
      characteristics.push(characteristic);
    });

    setMachine({
      ...machine!,
      data: { ...machine!.data, type: val, characteristics: characteristics },
    });
  };

  const handleCharacteristicsChange = (updatedCharacteristics: Characteristic[]) => {
    setMachine((prev) => {
      return {
        ...prev,
        data: {
          ...prev.data,
          characteristics: updatedCharacteristics,
        },
      };
    });
  };

  const handlePhotoChange = (gallery: GalleryItem[]) => {
    setMachine((prev) => {
      return {
        ...prev,
        data: {
          ...prev.data,
          gallery: gallery,
        },
      };
    });
  };

  const handleDescriptionChange = (value: string) => {
    setMachine({
      ...machine!,
      data: { ...machine!.data, fullDescription: value, description: value },
    });
  };

  const handleUpdate = (id: string, updatedData: DataItem['data'], files: File[]) => {
    dispatch(updateMachine({ id, updatedData, files }))
      .unwrap()
      .then(() => {
        setOpenSnackbar(true);
        dispatch(setEditor(!editor));
      })
      .catch((error) => {
        console.error('Failed to update machine:', error);
      });
  };

  return (
    <section className="w-full max-w-[1500px] my-10 mx-auto px-4">
      <Breadcrumb
        changeFunction={handleTypeAndModel}
        model={machine?.data.model || ''}
        type={machine?.data.type || ''}
      />
      <Loader />
      <div className="flex gap-[100px]">
        <div className="hidden lg:block ">
          <ItemGallery
            files={files}
            setFiles={setFiles}
            onChange={handlePhotoChange}
            gallery={machine?.data.gallery || []}
            onChangeMainPhoto={handleMainPhoto}
            mainImage={machine?.data.mainImage}
          />
        </div>
        <div className="flex flex-1 flex-col gap-10">
          <TitleMachine changeFunction={handleTitleChange} value={machine?.data.name || ''} />

          {editor ? (
            <>
              <FormControl>
                <InputLabel id="demo-select-small-label">Тип верстату</InputLabel>
                <Select
                  label="Тип верстату"
                  value={machine.data.type}
                  onChange={(e) => handleTypeChange(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Тип верстату</em>
                  </MenuItem>
                  {types.map((item, index) => (
                    <MenuItem key={index} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          ) : (
            ''
          )}

          <div className="lg:hidden w-full flex justify-center items-center">
            <ItemGallery
              files={files}
              setFiles={setFiles}
              onChange={handlePhotoChange}
              gallery={machine?.data.gallery || []}
              onChangeMainPhoto={handleMainPhoto}
              mainImage={machine.data.mainImage}
            />
          </div>

          <div className="flex justify-between items-center">
            <PriceMachine changeFunction={handlePriceChange} value={machine?.data.price || ''} />
            <ArticleMachine changeFunction={handleArticle} article={machine?.data.article} />
          </div>
          <div className="flex items-center text-[green] text-lg font-bold">
            <TaskAltIcon sx={{ marginRight: '8px' }} />В наявності
          </div>
          <EditableCharacteristics characteristics={machine?.data.characteristics || []} />
          <div>
            <button className="text-xl p-3 rounded-full font-medium bg-[#f74936] hover:bg-[#ce4a40] hover:shadow-lg  transition-all duration-300 ease-in-out transform">
              Зателефонувати
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10 mt-10">
        <DescriptionMachine changeFunction={handleDescriptionChange} description={machine?.data.fullDescription} />
        <TableHaracteristics
          characteristics={machine?.data.characteristics || []}
          onChange={handleCharacteristicsChange}
          machine={machine}
          currenTypeName={currenTypeName}
        />
      </div>
      {editor ? (
        <button
          onClick={() => handleUpdate(machine!.id, machine!.data, files)}
          className="fixed bottom-1/2 right-16 bg-[#e5e7eb] p-3 rounded-full shadow-lg"
        >
          <SaveAltIcon sx={{ fontSize: '40px', color: 'black' }} />
        </button>
      ) : (
        ''
      )}
      <CustomizedSnackbars openSnackbar={openSnackbar} setOpenSnackbar={setOpenSnackbar} />
    </section>
  );
};

const MachinePageWrapper = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <MachinePage />
  </Suspense>
);

export default MachinePageWrapper;
