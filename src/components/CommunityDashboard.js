import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const center = {
  lat: -19.9167, // Belo Horizonte coordinates
  lng: -43.9345,
};

const reportTypes = [
  { id: 'dust', label: 'Poeira', icon: '🔊', color: '#FF4444' },
  { id: 'noise', label: 'Ruído', icon: '💨', color: '#FFB74D' },
  { id: 'vibration', label: 'Vibração', icon: '📳', color: '#9C27B0' },
  { id: 'water', label: 'Água', icon: '💧', color: '#2196F3' },
  { id: 'risk', label: 'Risco', icon: '⚠️', color: '#FFC107' },
  { id: 'other', label: 'Outros', icon: '❗', color: '#757575' },
];

// Custom marker icon configuration
const createMarkerIcon = (color, opacity = 1) => ({
  path: 'M-8,0a8,8 0 1,0 16,0a8,8 0 1,0 -16,0',  // Circle path
  fillColor: color,
  fillOpacity: opacity,
  strokeWeight: 2,
  strokeColor: '#FFFFFF',
  scale: 1,
});

export default function CommunityDashboard() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [newReport, setNewReport] = useState({
    type: '',
    description: '',
    location: null,
  });
  const [newMarker, setNewMarker] = useState(null);
  const [formError, setFormError] = useState('');

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  // Fetch community reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const reportData = await api.communityReports.getAll();
        
        // Transform the data to match our component's expected format
        const formattedReports = reportData.map(report => ({
          id: report.id,
          type: report.category,
          description: report.description,
          // Generate random coordinates near our center for demonstration
          location: {
            lat: center.lat + (Math.random() - 0.5) * 0.1,
            lng: center.lng + (Math.random() - 0.5) * 0.1
          },
          status: Math.random() > 0.7 ? 'resolved' : (Math.random() > 0.5 ? 'in_review' : 'pending'),
          createdAt: report.created_at,
          zipcode: report.zipcode,
          user_id: report.user_id
        }));
        
        setReports(formattedReports);
        setError(null);
      } catch (err) {
        setError('Failed to load community reports. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReports();
  }, []);

  const handleMapClick = (event) => {
    // Add a new marker when user clicks on the map
    const clickedLoc = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setNewMarker(clickedLoc);
    setNewReport({ ...newReport, location: clickedLoc });
  };

  const handleReportTypeChange = (e) => {
    setNewReport({ ...newReport, type: e.target.value });
  };

  const handleDescriptionChange = (e) => {
    setNewReport({ ...newReport, description: e.target.value });
  };

  const handleSubmitReport = (e) => {
    e.preventDefault();
    
    if (!newReport.type) {
      setFormError('Por favor, selecione um tipo de ocorrência.');
      return;
    }
    
    if (!newReport.location) {
      setFormError('Por favor, selecione um local no mapa.');
      return;
    }
    
    if (!newReport.description.trim()) {
      setFormError('Por favor, forneça uma descrição.');
      return;
    }
    
    // Create new report
    const newReportObj = {
      id: reports.length + 1,
      ...newReport,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    // Add to reports list
    setReports([...reports, newReportObj]);
    
    // Reset form
    setNewReport({
      type: '',
      description: '',
      location: null,
    });
    setNewMarker(null);
    setFormError('');
  };

  const handleReportCardClick = (report) => {
    setSelectedReport(report);
    // Center map on selected report
    if (mapRef.current) {
      mapRef.current.panTo({ lat: report.location.lat, lng: report.location.lng });
      mapRef.current.setZoom(15);
    }
  };

  if (loadError) return <div className="container mx-auto px-4 py-8 text-center">Erro ao carregar o mapa</div>;
  if (!isLoaded) return <div className="container mx-auto px-4 py-8 text-center">Carregando mapa...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold">Mapa de Ocorrências</h2>
              <div className="flex space-x-4">
                <Link 
                  to="/forum" 
                  className="bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50"
                >
                  Ir para o Fórum
                </Link>
                <Link 
                  to="/messages" 
                  className="bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50"
                >
                  Mensagens
                </Link>
              </div>
            </div>
            <div className="p-4">
              <p className="mb-4 text-gray-600">
                Clique no mapa para marcar o local de uma nova ocorrência ou clique em um marcador para ver detalhes.
              </p>
              
              {loading ? (
                <div className="flex justify-center items-center h-64 bg-gray-100 rounded">
                  <p className="text-lg text-gray-600">Carregando ocorrências...</p>
                </div>
              ) : error ? (
                <div className="p-4 bg-red-100 text-red-800 rounded mb-4">
                  {error}
                </div>
              ) : (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  zoom={13}
                  center={center}
                  onClick={handleMapClick}
                  onLoad={onMapLoad}
                  options={{ 
                    streetViewControl: false, 
                    mapTypeControl: false 
                  }}
                >
                  {/* Existing reports markers */}
                  {reports.map((report) => {
                    const reportType = reportTypes.find(type => type.id === report.type) || reportTypes.find(type => type.id === 'other');
                    return (
                      <Marker
                        key={report.id}
                        position={{ lat: report.location.lat, lng: report.location.lng }}
                        icon={createMarkerIcon(reportType.color)}
                        onClick={() => setSelectedReport(report)}
                      />
                    );
                  })}
                  
                  {/* New report marker */}
                  {newMarker && (
                    <Marker
                      position={{ lat: newMarker.lat, lng: newMarker.lng }}
                      icon={createMarkerIcon('#000000', 0.5)}
                    />
                  )}
                  
                  {/* Info window for selected report */}
                  {selectedReport && (
                    <InfoWindow
                      position={{ lat: selectedReport.location.lat, lng: selectedReport.location.lng }}
                      onCloseClick={() => setSelectedReport(null)}
                    >
                      <div className="p-2">
                        <h3 className="font-bold text-lg">
                          {reportTypes.find(type => type.id === selectedReport.type)?.label || 'Ocorrência'}
                        </h3>
                        <p className="text-gray-700 mb-2">{selectedReport.description}</p>
                        <div className="flex justify-between text-sm">
                          <span className={`px-2 py-1 rounded-full ${
                            selectedReport.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            selectedReport.status === 'in_review' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {selectedReport.status === 'pending' ? 'Pendente' :
                            selectedReport.status === 'in_review' ? 'Em análise' :
                            'Resolvido'}
                          </span>
                          <span className="text-gray-500">
                            {new Date(selectedReport.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-4 bg-green-600 text-white">
              <h2 className="text-xl font-bold">Reportar Nova Ocorrência</h2>
            </div>
            <div className="p-4">
              <form onSubmit={handleSubmitReport}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Tipo de Ocorrência</label>
                  <select
                    value={newReport.type}
                    onChange={handleReportTypeChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">Selecione um tipo</option>
                    {reportTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Localização</label>
                  <div className="p-3 bg-gray-100 rounded">
                    {newReport.location ? (
                      <div>
                        <p className="text-sm">Coordenadas selecionadas:</p>
                        <p className="font-mono text-xs">
                          Lat: {newReport.location.lat.toFixed(6)}, Lng: {newReport.location.lng.toFixed(6)}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">Clique no mapa para definir a localização.</p>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Descrição</label>
                  <textarea
                    value={newReport.description}
                    onChange={handleDescriptionChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    rows="4"
                    placeholder="Descreva o problema em detalhes..."
                  ></textarea>
                </div>
                
                {formError && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {formError}
                  </div>
                )}
                
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                >
                  Enviar Ocorrência
                </button>
              </form>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-700 text-white">
              <h2 className="text-xl font-bold">Ocorrências Recentes</h2>
            </div>
            <div className="p-4">
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <p>Carregando ocorrências...</p>
                </div>
              ) : error ? (
                <div className="p-3 bg-red-100 text-red-700 rounded mb-4">
                  {error}
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {reports.length > 0 ? reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((report) => {
                    const reportType = reportTypes.find(type => type.id === report.type) || reportTypes.find(type => type.id === 'other');
                    return (
                      <div
                        key={report.id}
                        className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                        onClick={() => handleReportCardClick(report)}
                      >
                        <div className="flex items-center mb-2">
                          <span className="text-xl mr-2">{reportType?.icon}</span>
                          <span className="font-medium">{reportType?.label}</span>
                          <span className={`ml-auto px-2 py-1 text-xs rounded-full ${
                            report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            report.status === 'in_review' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {report.status === 'pending' ? 'Pendente' :
                            report.status === 'in_review' ? 'Em análise' :
                            'Resolvido'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{report.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(report.createdAt).toLocaleDateString()} {new Date(report.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    );
                  }) : (
                    <p className="text-gray-500 text-center py-4">Nenhuma ocorrência reportada ainda.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}