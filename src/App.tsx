import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Carbonasium from "./pages/Carbonasium.tsx";
import TrashProject from "./pages/TrashProject.tsx";
import Deforestation from "./pages/Deforestation.tsx";
import Endangered from "./pages/Endangered.tsx";
import SecondlyRubbishly from "./pages/SecondlyRubbishly.tsx";
import FlightRadarCO2 from "./pages/FlightRadarCO2.tsx";
import ElementStar from "./pages/ElementStar.tsx";
import RocketCarbon from "./pages/RocketCarbon.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/carbonasium" element={<Carbonasium />} />
          <Route path="/trash-project" element={<TrashProject />} />
          <Route path="/deforestation" element={<Deforestation />} />
          <Route path="/endangered" element={<Endangered />} />
          <Route path="/secondly-rubbishly" element={<SecondlyRubbishly />} />
          <Route path="/flight-radar-co2" element={<FlightRadarCO2 />} />
          <Route path="/element-star" element={<ElementStar />} />
          <Route path="/rocket-carbon" element={<RocketCarbon />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
