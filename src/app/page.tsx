'use client'
import { ShowComponent } from '@/components/articles';
import { resetServerContext, DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { useWriter } from '@/context/writer';
import { DownloadBox, MenuList, MoveDown, MoveUp } from '@/components/moveable';
import { useEffect, useRef, useState } from 'react';
import { UploadBox } from '@/components/moveable/uploadBox';
import { TextTest } from '@/components/textTest';

export default function HomePage() {
  useEffect(() => {
    resetServerContext()
  }, [])

  const { updateArticle, articleDetail } = useWriter();

  const [droppableId] = useState<string>("a961adfe-de5a-49de-a3a2-3176176b8242");

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return
    const { source, destination } = result;
    let copy = [...articleDetail]
    let [removed] = copy.splice(source.index, 1)
    copy.splice(destination.index, 0, removed)
    updateArticle(copy)

  };

  return (
    <main className="bg-base-100 base-content flex flex-col items-center justify-between overflow-x-hidden">
      <div className='max-w-[1440px] min-w-[320px] py-20
     w-screen'>
        <article className="mx-auto space-y-6 min-h-screen px-0 xs:px-0 sm:px-2 md:px-16 lg:px-40 xl:px-56">
          <TextTest />
          {/* <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId={droppableId}>
              {(provided, snapshot) => {
                return <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {articleDetail.map((detail, index) => {
                    return (<Draggable key={detail.id} draggableId={detail.id} index={index} >
                      {(provided, _) => {
                        return (<div
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                          className='my-2 group '>
                          <div className='w-full flex gap-x-2 items-center h-full relative'>
                            <div className='h-full absolute  text-neutral-content/0 group-hover:text-neutral-content group-hover:scale-100 scale-90 duration-100 transition-all flex items-center'>
                              <MenuList index={index} />
                            </div>
                            <div className='flex-1 h-full items-center px-8 ' >
                              <ShowComponent articleData={detail} index={index} />
                            </div>
                          </div>
                        </div>
                        )
                      }}
                    </Draggable>)
                  })}

                  {provided.placeholder}
                </div>
              }}
            </Droppable>
          </DragDropContext> */}
        </article>
      </div>
      {/* <MoveUp />
      <MoveDown />
      <UploadBox />
      <DownloadBox /> */}
    </main>
  )
}
