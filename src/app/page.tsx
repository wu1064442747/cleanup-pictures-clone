import TextCollageGenerator from "@/components/TextCollageGenerator";

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          图文拼贴生成器
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          上传多张图片并输入文字，生成独特的图文拼贴效果。
          图片将以文字形状进行排列，创造出个性化的视觉效果。
        </p>
      </header>
      
      <main>
        <TextCollageGenerator />
      </main>
      
      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p>图文拼贴生成器 MVP 版本</p>
        <p className="mt-1">© {new Date().getFullYear()} 版权所有</p>
      </footer>
    </div>
  );
}
