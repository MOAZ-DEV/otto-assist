"use client"
import { AwaitedReactNode, FormEvent, JSXElementConstructor, ReactElement, ReactNode, useState } from 'react';

const QAComponent = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [newAnswer, setNewAnswer] = useState('');

    const [answers, setAnswers] = useState<any>([]);

    const handleAsk = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://otto-assist.vercel.app/answer?question=${encodeURIComponent(question)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setAnswer(data.answer);
            setAnswers([...answers, answer])
        } catch (error) {
            console.error('Error fetching answer:', error);
        }
    };

    const handleProvideAnswer = async () => {
        try {
            const response = await fetch('https://otto-assist.vercel.app/answer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question, answer: newAnswer })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            setAnswer(newAnswer);
            setNewAnswer('');
        } catch (error) {
            console.error('Error providing answer:', error);
        }
    };

    const AnswerBlock = ({ Ans }: any) =>
        <div className='flex flex-col gap-3 bg-zinc-950 py-3 px-3 rounded-lg border border-zinc-900'>
            <p>Otto: {Ans}</p>
            {Ans === "I don't know the answer to that question. Can you provide the answer?" && (
                <> <input
                    type="text"
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    placeholder="Provide the answer"
                    className='w-full bg-zinc-900 px-3 py-2 rounded-md'
                />
                    <button type='submit' className='py-3 px-6 bg-violet-500 rounded-lg' onClick={handleProvideAnswer}>[Save]</button></>
            )}
        </div>;

    return (
        <div className='flex flex-col gap-4 max-w-md *:font-mono'>
            {answer && <AnswerBlock Ans={answer} />}
            <form onSubmit={e => handleAsk(e)} className="flex flex-row gap-2">
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Press [enter] to send.."
                    className='w-full bg-zinc-950 px-4 py-3 rounded-lg border !border-zinc-800 focus:!border-l-violet-900'
                />
                <button type='submit' className='py-3 px-6 bg-violet-500 rounded-lg'>[Ask]</button>
            </form>
        </div>
    );
};
export default QAComponent;
