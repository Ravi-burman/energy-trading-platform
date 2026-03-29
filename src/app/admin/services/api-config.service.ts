import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable()
export class ApiConfigService {
  constructor() { }
  api = {
    // User Profile
    // getCountryCodes: '/country_code',
    updateProfile: '/update_user_profile/',


    // Roles

    getRoles: '/get_role_list/',
    createRole: '/admin/create_role/',
    updateRole: '/update_role/',
    deleteRole: '/delete_role/?role_id={id}',
    getRoleById: '/role',
    getActiveRoles: '/get_active_roles/',

    //Privileges

    getActivePrivileges:'/get_active_privileges/',


    // Users

    getUsers: '/get_user_list/',
    createUser: '/admin/create_user/',
    updateUser: '/update_user/',
    deleteUser: '/delete_user/?user_id={id}',
    getUserById: '/user/{id}',

    // Countries
    getCountry: '/get_country_list/',
    createCountry: '/admin/create_country/',
    deleteCountry: '/delete_country/?country_id={id}',
    updateCountry: '/update_country/',

    // Market Provider
    getMarketProvider: '/get_mkt_providers/',
    createMarketProvider: '/admin/create_market_providers/',
    deleteMarketProvider: '/delete_mkt_provider/?mkt_provider_id={id}',
    updateMarketProvider: '/update_mkt_provider/',

    // Market Type 
    getMarketType:'/get_mkt_type/',
    createMarketType:'/admin/create_market_type/',
    deleteMarketType:'/delete_mkt_type/?mkt_type_id={id}',
    updateMarketType:'/update_mkt_type/',
    getMarketProviderForMarketType:'/get_mkt_provider_by_country_id/?country_id={id}',

    //RLDCS
    getRldc: '/get_rldc/',
    createRldc: '/admin/create_rldc/',
    deleteRldc: '/delete_rldc/?rldc_id={id}',
    updateRldc: '/update_rldc/',

    // Market Areas
    getMarketArea: '/get_mkt_areas/',
    createMarketArea: '/admin/create_market_area/',
    deleteMarketArea: '/delete_mkt_area/?mkt_area_id={id}',
    updateMarketArea: '/update_mkt_area/',
    getRldcForMarketAreas:'/get_rldc_by_country_id/?country_id={id}',

    //States
    getState:'/get_states/',
    createState:'/admin/create_state/',
    deleteState:'/delete_state/?state_id={id}',
    updateState:'/update_state/',
    getMarketAreaForState:'/get_mkt_area_by_country_id/?country_id={id}',

    //Individual Entity
    getEntity:'/get_entities/',
    getParentType:'/get_active_parent_type/',
    createEntity:'/admin/create_entity/',
    createParentType:'/admin/create_parent_type/',
    deleteEntity:'/delete_entity/?entity_id={id}',
    updateEntity:'/update_entity/',
    getStateForEntity:'/get_state_by_country_id/?country_id={id}',
    getEntityType:'/get_entity_type/',


    //RealTime Data Population status
    getIEX: '/get_iex_status/',
    getWBES: '/get_wbes_status/',
    getForecastStatus: '/get_forecast_status/',
    getRtmForecastStatus:'/get_rtm_forecast_status/',
    getPxilForecastStatus:/pxil_status/,
    getIgxStatus :'/igx_status/',
    //getForecastData:'/get_current_forecast_data/',
    
    // Graph Data
    getPvdGraphData: '/get_graphdata_price_vs_demand/',
    getPriceVolumesGraph:'/get_graphdata_price_vs_volume/',
    getMeanPvdGraphData :'/get_graphdata_price_vs_demand_stats/',
    getMeanPvvGraphData : '/get_graphdata_price_vs_volume_stats/',
    getPriceVolumeStatisticsGraph : '/price_vs_volume_stats_graph/',
    // Model Wise Forecast Data
    getForecastActualGraph : '/dam_forecast_metrics_graph_data/',
    getLatestMetrics : '/latest_rtm_96_metrics/',  //latest rtm_96_metrics
    getDailyRtmMetrics:'/daily_rtm_96_metrics/', //Daily rtm_96_metrics
    getForecastModelwise : '/get_forecast_modelwise/',
    getGdamForecastGraph:'/gdam_forecast_metrics_graph_data/',
    getGdamForecastModewise:'/gdam_model_wise_forecast/',
    // getIgxIndiaMap : '/igx_india_map/',
    getIndiaMapGraph : '/get_india_map_data/',
    getInstCapacityData: '/get_states_installed_capacity/',
    getGeneratorsData : '/get_generator_map_data/',
    getGeneratorOutagesData:'/timeseries_outages/',

    // RTM Graph Data
    getRtmForeCastData :'/get_rtm_forecast_modelwise/',
    getRtmForecastVsActual: '/get_rtm_forecast_vs_actual_data/',
    getRtm192ForecastVsActual: '/get_rtm192_forecast_vs_actual_data/',

    // IGX Graph Data
    getIgxDeliveryCodeData:'/get_igx_delivery_area_code/',
    getIgxGraphData:'/get_igx_price_vs_vol/',
    getIgxDeliveryArea:'/get_igx_delivery_area/',
    getIexAreaCodeData:'/get_iex_area_codes/',
    getIexAreaTypes : '/get_iex_area_types/',
    getIgxPriceVolumeData:'/get_igx_profiles/',
    getIgxBarGraph:'/get_igx_profiles_bar_graph/',
    getIexBarGraph:'/get_iex_profiles_bar_graph/',
    getIgxIndiaMap:'/get_igx_india_map_data/',
    getIrnsIndiaMapData: '/get_irns_schedule_data'




  };
  getApiUrl(key?: any) {
    return environment.baseUrl + this.api[key];
  }
}
