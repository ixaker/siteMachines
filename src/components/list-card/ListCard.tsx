import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import Card from "./Card";
import { useEffect } from "react";
import { fetchMachines } from "@/store/slice/dataSlice";

const ListCard = () => {
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchMachines());
  }, [dispatch]);

  const list = useSelector((state: RootState) => state.data.data);

  return (
    <section className="w-full max-w-[1200px] my-10 mx-auto px-4">
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((item, index) => (
            <Card item={item} key={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ListCard;
