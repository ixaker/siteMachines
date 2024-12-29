export async function generateStaticParams() {
    // Укажите все значения id, которые нужно сгенерировать
    const ids = ["1", "2", "3"]; // Замените на ваши реальные значения
  
    return ids.map((id) => ({ id }));
  }
  
// app/machine/[id]/page.tsx
interface Params {
    id: string;
  }
  
  export default function MachinePage({ params }: { params: Params }) {
    const { id } = params;
  
    return (
      <div>
        <h1>Machine ID: {id}</h1>
      </div>
    );
  }
  