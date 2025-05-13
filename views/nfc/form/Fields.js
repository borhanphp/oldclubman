import React, { useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useSelector, useDispatch } from 'react-redux';
import { addField, removeField, setFields, reorderFields, updateField, getNfcField } from '../store';


function FieldPickerSidebar({ nfcFieldsResponse, onAddField }) {
  
  const CATEGORY_MAP = {
    1: "Most Popular",
    2: "Social",
    3: "Communication",
    4: "Conferencing",
    5: "Payment",
    6: "Video",
    7: "Music",
    8: "Design",
    9: "Gaming",
    10: "Other"
  };
  // Optionally group by category
  const grouped = nfcFieldsResponse.reduce((acc, field) => {
    const cat = CATEGORY_MAP[field.category] || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(field);
    return acc;
  }, {});

  return (
    <>
      {Object.entries(grouped).map(([cat, fields]) => (
        <div key={cat} className="mb-6">
          <h4 className="font-semibold text-md mb-2">{cat }</h4>
          <div className="flex flex-wrap gap-2">
            {fields.map(field => (
              <button
                key={field.id}
                className="px-3 py-1 rounded-full border border-purple-300 bg-white hover:bg-purple-100 text-sm text-purple-900 transition"
                onClick={() => onAddField(field)}
                type="button"
              >
                {field.name}
              </button>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

function FieldFormsArea({ fields, onRemoveField, onReorderFields, onUpdateField }) {
  function handleDragEnd(result) {
    if (!result.destination) return;
    const reordered = Array.from(fields);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    onReorderFields(reordered);
  }

  console.log('fields',fields)

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="fields-droppable">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.draggableProps}>
            {fields.length === 0 && (
              <div className="text-gray-400 italic text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">Add a field from the right</div>
            )}
            {fields.map((field, idx) => (
              <Draggable key={field.uid} draggableId={field.uid} index={idx}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`mb-4 bg-white rounded-xl shadow p-4 border-2 ${snapshot.isDragging ? 'border-blue-400' : 'border-gray-100'} flex flex-col relative`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span {...provided.dragHandleProps} className="cursor-move text-gray-400">&#9776;</span>
                        <span className="font-bold text-lg">{field.label}</span>
                      </div>
                      <button className="text-gray-400 hover:text-red-500" onClick={() => onRemoveField(field.uid)}>&times;</button>
                    </div>
                    {/* Field inputs for backend: Username, Label, Display Text */}
                    <div className="flex flex-col gap-3">
                      <input
                        type="text"
                        placeholder="Username"
                        className="w-full border rounded px-3 py-2 text-sm"
                        value={field.nfc_user_name || ''}
                        onChange={e => onUpdateField(field.uid, 'nfc_user_name', e.target.value)}
                      />
                      {field.type === 1 ? 
                      <>
                      <input
                        type="text"
                        placeholder="Display Text"
                        className="w-full border rounded px-3 py-2 text-sm"
                        value={field.display_name || ''}
                        onChange={e => onUpdateField(field.uid, 'display_name', e.target.value)}
                      />
                      </> : field.type === 3 ?
                      <>
                       <input
                        type="textarea"
                        placeholder="Display Text"
                        className="w-full border rounded px-3 py-2 text-sm"
                        value={field.display_name || ''}
                        onChange={e => onUpdateField(field.uid, 'display_name', e.target.value)}
                      />
                      </> :
                      <>
                       <input
                        type="date"
                        placeholder="date"
                        className="w-full border rounded px-3 py-2 text-sm"
                        value={field.display_name || ''}
                        onChange={e => onUpdateField(field.uid, 'display_name', e.target.value)}
                      />
                      </> }
                      
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

function Fields() {
  const { nfcFieldsResponse, fields } = useSelector(({ nfc }) => nfc);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getNfcField())
  }, [dispatch]);

  // Add a field with a unique id
  const handleAddField = (fieldType) => {
    dispatch(addField({
      id: fieldType.id, // nfc_id
      nfc_label: fieldType.name, // default label
      label: fieldType.name,
      nfc_user_name: '', // user will fill
      display_name: '', // user will fill
      uid: `${fieldType.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type: fieldType.type,
      ...fieldType // keep other info if needed
    }));
  };
  const handleRemoveField = (uid) => {
    dispatch(removeField(uid));
  };
  const handleReorderFields = (reordered) => {
    dispatch(reorderFields(reordered));
  };
  const handleUpdateField = (uid, key, value) => {
    dispatch(updateField({ uid, key, value }));
  };

  return (
    <div className="py-3 flex flex-col md:flex-row gap-6">
      <div className="flex-1 min-w-0">
        <FieldFormsArea
          fields={fields}
          onRemoveField={handleRemoveField}
          onReorderFields={handleReorderFields}
          onUpdateField={handleUpdateField}
        />
      </div>
      <div className="w-full md:w-64 bg-purple-50 rounded-lg p-4">
        <FieldPickerSidebar nfcFieldsResponse={nfcFieldsResponse} onAddField={handleAddField} />
      </div>
    </div>
  );
}

export default Fields; 