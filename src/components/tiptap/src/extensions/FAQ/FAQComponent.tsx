import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { useState, useRef } from "react";
import { Icon } from "../../components/ui/Icon";

const FaqComponent = ({ node, updateAttributes }: any) => {
  const initialFaqs = node.attrs.faqs || [{ question: "", answer: "", isOpen: false }];
  const [faqs, setFaqs] = useState(initialFaqs);

  const answerRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleToggle = (index: number) => {
    setFaqs((prev: any) => {
      const updated = prev.map((faq: any, i: number) => {
        const isOpening = i === index && !faq.isOpen;
        return {
          ...faq,
          isOpen: i === index ? !faq.isOpen : faq.isOpen,
        };
      });

      const isNowOpen = !prev[index].isOpen;
      if (isNowOpen) {
        setTimeout(() => {
          answerRefs.current[index]?.focus();
        }, 10);
      }

      return updated;
    });
  };

  const handleChange = (index: number, field: "question" | "answer", value: string) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index][field] = value;
    setFaqs(updatedFaqs);
    updateAttributes({ faqs: updatedFaqs });
  };

  const handleAddFaq = () => {
    const newFaqs = [...faqs, { question: "", answer: "", isOpen: true }];
    setFaqs(newFaqs);
    updateAttributes({ faqs: newFaqs });
  };

  return (
    <NodeViewWrapper data-type="faq" className="my-4">
      <div className="space-y-2">
        {faqs.map((faq: any, index: number) => (
          <div key={index} className="border-b border-black">
            <div className="flex items-center justify-between px-4 py-1">
              <input
                type="text"
                value={faq.question}
                onChange={(e) => handleChange(index, "question", e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleToggle(index);
                  }
                }}
                placeholder="Enter your question..."
                className="w-full px-3 py-2 border-none text-lg font-bold outline-none"
              />
              <button
                onClick={() => handleToggle(index)}
                className="flex items-center px-1 py-1 hover:bg-gray-100 rounded-md"
              >
                <Icon
                  name="ChevronDown"
                  className={`w-6 h-6 text-black transition-transform duration-200 ${
                    faq.isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
            <div
              className={`transition-all duration-300 ease-in-out px-4 pb-2 ${
                faq.isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
              }`}
            >
              <input
                ref={(el) => {
                  answerRefs.current[index] = el;
                }}
                type="text"
                value={faq.answer}
                onChange={(e) => handleChange(index, "answer", e.target.value)}
                placeholder="Enter your answer..."
                className="w-full px-3 border-none text-sm outline-none"
              />
            </div>
          </div>
        ))}

        <div className="px-4 flex items-center justify-center">
          {window && window.editor?.isEditable && (
            <button
              onClick={handleAddFaq}
              className="py-2 px-4 mx-2 border border-dashed border-gray-400 rounded-full flex items-center justify-center hover:bg-gray-100"
            >
              + Add another question
            </button>
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default FaqComponent;
