import React, { useEffect, useRef, useState } from 'react';

const VideoUploadPage: React.FC = () => {
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        async function initMedia() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }

                const recorder = new MediaRecorder(stream, {
                    mimeType: 'video/webm; codecs=vp9',
                });

                recorder.ondataavailable = async (event) => {
                    if (event.data.size > 0) {
                        await sendData(event.data);
                    }
                };

                setMediaRecorder(recorder);
            } catch (error) {
                console.error('Ошибка при доступе к камере:', error);
            }
        }

        initMedia();
        return () => {
            mediaRecorder?.stop();
        };
    }, []);

    const startRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.start(1000); // Отправляем данные каждые 1000 мс
            setIsRecording(true);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    };

    async function sendData(blob: Blob) {
        const formData = new FormData();
        formData.append('file', blob, 'video_chunk.webm');

        await fetch('http://127.0.0.1:8000/video/process_video', {
            method: 'POST',
            body: formData,
        });
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-6 bg-white rounded-lg shadow-lg max-w-md text-center space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800">Видео анализатор</h2>
                <p className="text-gray-600">
                    Нажмите кнопку ниже, чтобы начать запись видео с камеры и отправить его на сервер для анализа.
                </p>

                <div className="relative w-full overflow-hidden rounded-lg shadow-md">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        className="w-full h-64 bg-gray-200 object-cover rounded-lg"
                    />
                    {!isRecording && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                            <p className="text-white text-lg font-medium">Камера готова</p>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-center space-x-4">
                    <button
                        onClick={startRecording}
                        disabled={isRecording}
                        className={`px-4 py-2 rounded-md font-semibold text-white ${
                            isRecording ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
                        }`}
                    >
                        Начать запись
                    </button>
                    <button
                        onClick={stopRecording}
                        disabled={!isRecording}
                        className={`px-4 py-2 rounded-md font-semibold text-white ${
                            !isRecording ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'
                        }`}
                    >
                        Остановить запись
                    </button>
                </div>

                <p className="text-gray-500 text-sm">
                    Данные отправляются в реальном времени и не сохраняются на сервере.
                </p>
            </div>
        </div>
    );
};

export default VideoUploadPage;
