'use client';

import ItemGallery from '@/components/item-gallery/ItemGallery';
import { getMachine } from '@/shared/storage';
import { Characteristic, DataItem, GalleryItem } from '@/types/types';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import StoreIcon from '@mui/icons-material/Store';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { useSearchParams, useRouter } from 'next/navigation';
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

const MachinePage = () => {
  const [machine, setMachine] = useState<DataItem>();
  const dispatch: AppDispatch = useDispatch();
  const editor = useSelector(selectEditor);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  const id = searchParams.get('id');

  if (!id) {
    router.push('/');
  }

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
  }, [id]);

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

  const handleCharacteristicsChange = (updatedCharacteristics: Characteristic[]) => {
    setMachine((prev) => {
      if (!prev) {
        return undefined; // Если объекта нет, возвращаем undefined
      }

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
      if (!prev) {
        return undefined;
      }
      return {
        ...prev,
        data: {
          ...prev.data,
          gallery: gallery,
        },
      };
    });
  };

  const handleUpdate = (id: string, updatedData: DataItem['data']) => {
    dispatch(updateMachine({ id, updatedData }))
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
      <Breadcrumb model={machine?.data.model || ''} type={machine?.data.type || ''} />

      <div className="flex gap-10">
        <ItemGallery onChange={handlePhotoChange} gallery={machine?.data.gallery || []} />
        <div className="flex flex-1 flex-col gap-10">
          <TitleMachine changeFunction={handleTitleChange} value={machine?.data.name || ''} />

          <div className="flex justify-between items-center">
            <PriceMachine changeFunction={handlePriceChange} value={machine?.data.price || ''} />
            <div>
              <span>Код: {machine?.data.article}</span>
            </div>
          </div>
          <EditableCharacteristics
            characteristics={machine?.data.characteristics || []}
            onChange={handleCharacteristicsChange}
          />
          <div>
            <button className="text-xl p-3 rounded-full font-medium bg-[#f74936] hover:bg-[#ce4a40] hover:shadow-lg  transition-all duration-300 ease-in-out transform">
              Зателефонувати
            </button>
          </div>
          <ul className="flex justify-center gap-10">
            <li className="flex gap-4">
              <div className="bg-[#f6f6f6] p-3 rounded-lg">
                <LocalShippingIcon />
              </div>
              <div className="flex flex-col">
                <span className="text-[#828282]">Безкоштовна Доставка</span>
                <span className="font-medium">1-2 дні</span>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="bg-[#f6f6f6] p-3 rounded-lg">
                <StoreIcon />
              </div>
              <div className="flex flex-col">
                <span className="text-[#828282]">В Наявності</span>
                <span className="font-medium">Сьогодні</span>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="bg-[#f6f6f6] p-3 rounded-lg">
                <WorkspacePremiumIcon />
              </div>
              <div className="flex flex-col">
                <span className="text-[#828282]">Гарантія</span>
                <span className="font-medium">1 рік</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-10 mt-10">
        <article>
          <label className="text-2xl font-bold">Опис</label>
          <p className="text-[18px] mt-5">{machine?.data.fullDescription}</p>
        </article>

        <TableHaracteristics characteristics={machine?.data.characteristics || []} />
      </div>
      {editor ? (
        <button
          onClick={() => handleUpdate(machine!.id, machine!.data)}
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
