import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CommonService } from '../services/common.service';
import { CommonUtilityService } from 'src/app/services/common-utility.service';
import { Paginator } from 'primeng/paginator';

@Component({
  selector: 'app-admin-individual-entities',
  templateUrl: './admin-individual-entities.component.html',
  styleUrls: ['./admin-individual-entities.component.scss']
})
export class AdminIndividualEntitiesComponent {
  @ViewChild('individualEntitiesdt') individualEntitiesdt: Table;
  @ViewChild('paginator') paginator: Paginator;
  entities: any = [];
  loading: boolean = true;
  searchValue: any = '';
  entityObj: any = {};
  addStateSection: boolean = false;
  listViewSection: boolean = true;
  submitted: boolean = false;
  statuses: any = [{ name: 'All', value: '' }, { name: 'Active', value: 'Active' }, { name: 'Inactive', value: 'Inactive' }];
  options: any = [{ name: 'Entity Name', value: 'name' }, { name: 'Parent Type', value: 'parent_type_name' }, { name: 'Parent', value: 'parent_value_name' }, { name: 'Country', value: 'country_name' }];
  selectedStatus: any;
  filteredEntities: any = [];
  selectedOption: any;
  getEntityLoading: boolean = false;
  currentPageIndex = 0;
  paginatorOptions: any = {};
  currentListPage: any;
  defaultSortField = 'name';
  defaultSortOrder = 1;
  retainedSortOrder: number;
  retainedSortField: string;
  hasIndividualEntity = false;
  countriesList: any = [];
  typeList: any = [];
  selectedStateOption: any;
  selectedParentOptions: any = [];
  selectedParent: any;
  areas: any = [];
  rldcs: any = [];
  states: any = [];

  constructor(private confirmationService: ConfirmationService,
    private commonService: CommonService,
    private messageService: MessageService,
    private commonUtilityService: CommonUtilityService) {

    this.paginatorOptions = {
      rowsPerPageOptions: [10, 20, 30, 40, 50],
      rows: 10,
      first: 0
    };

  }

  ngOnInit() {
    this.selectedOption = '';
    this.getEntity();
    this.getCountry();
    this.getEntityType();

    const selected_parent_type_code = localStorage.getItem('selected_parent_type_code');
    if (selected_parent_type_code) {
      const selectedCountryId = localStorage.getItem('selected_country_id');
      if (selectedCountryId) {
        if (selected_parent_type_code === 'rldc') {
          // Call the function to get Rldc data
          this.getRldc(selectedCountryId);
        } else if (selected_parent_type_code === 'market_area') {
          // Call the function to get Market Area data
          this.getMarketArea(selectedCountryId);
        } else if (selected_parent_type_code === 'state') {
          // Call the function to get State data
          this.getstate(selectedCountryId);
        }
      }
    }


    this.loading = false;
  }


  ngAfterViewInit() {
    if (this.individualEntitiesdt) {
    }
  }

  onPageChange(event: any) {
    this.currentPageIndex = event.page;
    this.currentPageIndex = event.first;
    this.currentListPage = event.rows;
  }
  // call the function to get the entity data
  getEntity() {
    this.getEntityLoading = true;
    this.commonService.getEntity({}).subscribe((res) => {
      if (res && res.status === this.commonUtilityService.SUCCESS) {
        this.entities = res.data.individual_entities;
        this.filteredEntities = this.entities;
        this.hasIndividualEntity = this.entities && this.entities.length > 0;
        this.getEntityLoading = false;
      } else {
        this.commonUtilityService.singleErrorMsg(res.error);
        this.getEntityLoading = false;
      }
    }, (err: any) => {
      this.getEntityLoading = false;
      this.commonUtilityService.showErrorMessage(err);
    })
  }

  getstate(id) {
    this.getEntityLoading = true;
    this.commonService.getStateForEntity(id, {}).subscribe((res) => {
      if (res && res.status === this.commonUtilityService.SUCCESS) {
        this.selectedParent = res.data.state.filter((state) => { return state.is_active === true })
          .map((state) => ({ ...state, name: state.name.toUpperCase() }));

        this.getEntityLoading = false;
      } else {
        this.commonUtilityService.singleErrorMsg(res.error);
        this.getEntityLoading = false;
      }
    }, (err: any) => {
      this.getEntityLoading = false;
      this.commonUtilityService.showErrorMessage(err);
    })
  }





  // call the fucntion to get the mktarea data
  getMarketArea(id) {
    this.getEntityLoading = true;
    this.commonService.getMarketAreaForState(id, {}).subscribe((res) => {
      if (res && res.status === this.commonUtilityService.SUCCESS) {
        this.selectedParent = res.data.market_area.filter((mktArea) => { return mktArea.is_active === true })
          .map((mktArea) => ({ ...mktArea, name: mktArea.name.toUpperCase() }));
        this.getEntityLoading = false;
      } else {
        this.commonUtilityService.singleErrorMsg(res.error);
        this.getEntityLoading = false;
      }
    }, (err: any) => {
      this.getEntityLoading = false;
      this.commonUtilityService.showErrorMessage(err);
    })
  }
  // call the function to get the rldc data
  getRldc(id) {
    this.getEntityLoading = true;
    this.commonService.getRldcForMarketAreas(id, {}).subscribe((res) => {
      if (res && res.status === this.commonUtilityService.SUCCESS) {
        this.selectedParent = res.data.rldc.filter((rldc) => { return rldc.is_active === true })
          .map((rldc) => ({ ...rldc, name: rldc.name.toUpperCase() }));
        this.getEntityLoading = false;
      } else {
        this.commonUtilityService.singleErrorMsg(res.error);
        this.getEntityLoading = false;
      }
    }, (err: any) => {
      this.getEntityLoading = false;
      this.commonUtilityService.showErrorMessage(err);
    })
  }

  // call the function to get the country data
  getCountry() {
    this.getEntityLoading = true;
    this.commonService.getCountry({}).subscribe((res) => {
      if (res && res.status === this.commonUtilityService.SUCCESS) {
        this.countriesList = res.data.country_list
          .filter((country) => country.is_active === true)
          .map((country) => ({
            ...country,
            name: country.name.toUpperCase()
          }));
        this.getEntityLoading = false;
      } else {
        this.commonUtilityService.singleErrorMsg(res.error);
        this.getEntityLoading = false;
      }
    }, (err: any) => {
      this.getEntityLoading = false;
      this.commonUtilityService.showErrorMessage(err);
    });
  }
  // call the funtion to get the type of the entity
  getEntityType() {
    this.getEntityLoading = true;
    this.commonService.getEntityType({}).subscribe((res) => {
      if (res) {
        this.typeList = Object.entries(res).map(([key, value]) => ({
          key, // key like "type1", "type2"
          value // value like "Buyer", "Seller"
        }));
        this.getEntityLoading = false;
      }
    });
  }


  // call the function to get the parent type of the entity
  getParentType() {
    this.getEntityLoading = true;
    this.commonService.getParentType({}).subscribe((res) => {
      if (res && res.status === this.commonUtilityService.SUCCESS) {
        this.selectedParentOptions = res.data.parent_type
          .filter((parent) => parent.is_active === true)
          .map((parent) => ({
            ...parent,
            name: parent.name.toUpperCase()
          }));
        const codes = this.selectedParentOptions.map((parent) => parent.code);
        localStorage.setItem('parent_type_codes', JSON.stringify(codes));
        this.getEntityLoading = false;
      } else {
        this.commonUtilityService.singleErrorMsg(res.error);
        this.getEntityLoading = false;
      }
    }, (err: any) => {
      this.getEntityLoading = false;
      this.commonUtilityService.showErrorMessage(err);
    });
  }
  // this function is used to get the country data
  onCountryChange(selectedCountry) {
    if (selectedCountry) {
      const countryId = selectedCountry.id;
      localStorage.setItem('country_id', countryId);
    }
    this.getParentType();
  }

  onParentTypeChange(selectedParentType) {
    this.getParentType();
    this.entityObj.selectedParentEntity = null;

    if (selectedParentType) {
      const selectedCountry = this.entityObj.selectedCountry;
      if (selectedCountry) {
        if (selectedParentType.code === 'rldc') {
          this.getRldc(selectedCountry.id);
        } else if (selectedParentType.code === 'market_area') {
          this.getMarketArea(selectedCountry.id);
        } else if (selectedParentType.code === 'state') {
          this.getstate(selectedCountry.id);
        }
      }
    }
  }


  // call the function to check the selected parent data
  checkSelectedParentType() {
    const selectedParentType = this.entityObj.selectedParent;
    const selectedCountry = this.entityObj.selectedCountry;
    const storedCodes = JSON.parse(localStorage.getItem('parent_type_codes'));

    if (selectedParentType && storedCodes) {
      const matchedCode = storedCodes.find(code => code === selectedParentType.code);

      if (matchedCode === 'rldc') {
        this.getRldc(selectedCountry.id);
      }
      if (matchedCode === 'market_area') {
        this.getMarketArea(selectedCountry.id);
      }
      if (matchedCode === 'state') {
        this.getstate(selectedCountry.id);
      }
    }
  }

  // this function is used to add new entity or edit the existing entity

  add_or_edit_Entity(individualEntity?) {
    this.getParentType();

    if (individualEntity === undefined) {
      this.entityObj = {};
      this.entityObj.is_active = true;
    } else {
      if (
        individualEntity.parent_type_code !== undefined ||
        individualEntity.parent_type_code !== null
      ) {
        const selectedCountryId = localStorage.getItem('selected_country_id');
        if (individualEntity.country_id) {
          if (individualEntity.parent_type_code === 'rldc') {
            this.getRldc(individualEntity.country_id);
          } else if (individualEntity.parent_type_code === 'market_area') {
            this.getMarketArea(individualEntity.country_id);
          } else if (individualEntity.parent_type_code === 'state') {
            this.getstate(individualEntity.country_id);
          }
        }
      }

      if (individualEntity.id) {
        this.loading = true;
        setTimeout(() => {
          localStorage.setItem('selected_country_id', individualEntity.country_id);
          localStorage.setItem(
            'selected_parent_type_code',
            individualEntity.parent_type_code
          );
          this.entityObj = individualEntity;
          const selectedCountry = this.countriesList.filter(
            (b: any) => b.id === individualEntity.country_id
          );
          const selectedParentType = this.selectedParentOptions.find(
            (option) => option.id === individualEntity.parent_type_id
          );

          const selectedParentEntity = this.selectedParent.filter(
            (option) => option.id === individualEntity.parent_value_id
          );
          const selectedEntityType = this.typeList.find(
            (option) => option.type === individualEntity.value
          );

          this.entityObj.selectedParent = selectedParentType;
          this.entityObj.selectedParentEntity = selectedParentEntity[0];
          this.entityObj.selectedCountry = selectedCountry[0];
          this.entityObj.selectedType = selectedEntityType;
          this.loading = false;
        }, 1000);

        this.entityObj.is_active = individualEntity.is_active;
      }
    }

    this.addStateSection = true;
    this.listViewSection = false;
  }

  // call this function to cancel the form
  cancelForm() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Cancel?',
      header: 'Confirmation',
      accept: () => {
        this.addStateSection = false;
        this.listViewSection = true;
        this.getEntity();
        localStorage.removeItem('selected_country_id');
        localStorage.removeItem('selected_parent_type_code');

      },
      reject: (type: any) => {
      }
    });
  }


  // call this fucntion to create a new entity or update the existing entity
  create_or_update_Entity(form: NgForm, type, individualEntity) {
    debugger;
    if (form.invalid) {
      return;
    }
    this.submitted = true;
    this.loading = true;
    let data = form.value;
    data = {
      "name": data.name,
      "country_id": data.country_id.id,
      "parent_type_id": data.parent_type_id.id,
      "parent_value_id": data.parent_value_id.id,
      "type": data.type.value,
      "is_active": data.is_active
    }
    if (type === 'add') {
      delete data.country;
      this.commonService.createEntity(
        {
          data,
          headers: {
          }
        }
      ).subscribe((res: any) => {
        if (res && res.status === this.commonUtilityService.SUCCESS) {
          this.commonUtilityService.showSuccessMessage(res.data.message);
          this.loading = false;
          this.getEntity();
          this.selectedStatus = '';
          this.listViewSection = true;
          this.addStateSection = false;
        } else {
          this.commonUtilityService.singleErrorMsg(res.error);
          this.loading = false;
        }
      }, (err: any) => {
        this.loading = false;
        this.commonUtilityService.showErrorMessage(err);
      })
    } if (type === 'update') {
      delete data.country;
      data.id = individualEntity.id;
      this.loading = true;
      this.commonService.updateEntity(
        {
          data,
          headers: {
          }
        }
      ).subscribe((res: any) => {
        if (res && res.status === this.commonUtilityService.SUCCESS) {
          this.commonUtilityService.showSuccessMessage(res.data.message);
          this.loading = false;
          this.getEntity();
          this.listViewSection = true;
          this.addStateSection = false;

        } else {
          this.commonUtilityService.singleErrorMsg(res.error);
          this.loading = false;
        }
      }, (err: any) => {
        this.loading = false;
        this.commonUtilityService.showErrorMessage(err);
      })
    }


  }
  // call this function to reset the data
  resetForm(individualEntityForm: NgForm) {
    this.entityObj = {};
    this.entityObj.is_active = true;
    this.getEntity();

  }

  activeStatusChange(is_active) {

  }

  // this function is used to get data based on dropdown 
  changeDropdown() {
    this.searchValue = '';
    this.filteredEntities = this.entities;
  }


  // it is used to fetch the search data
  search(event: any) {
    this.searchValue = event;
    this.filterUsers();
  }

  // it is used to fetch the search data
  filterUsers() {
    // if(this.selectedOption.value==='name'){
    //   if (this.selectedStatus.value === '') {
    //     this.filteredEntities = this.entities.filter((individualEntity)=>
    //     individualEntity.name.toLowerCase().includes(this.searchValue));
    //   } else if (this.selectedStatus.value === 'Active') {
    //     this.filteredEntities = this.entities.filter((individualEntity) => 
    //     individualEntity.is_active === true && individualEntity.name.toLowerCase().includes(this.searchValue));
    //   } else if (this.selectedStatus.value === 'Inactive') {
    //     this.filteredEntities = this.entities.filter((individualEntity) => 
    //     individualEntity.is_active === false && individualEntity.name.toLowerCase().includes(this.searchValue));
    //  }
    // }
    // else if (this.selectedOption.value==='parent_type_name'){
    //   if (this.selectedStatus.value === '') {
    //     this.filteredEntities = this.entities.filter((individualEntity)=>
    //     individualEntity.parent_type_name.toLowerCase().includes(this.searchValue));
    //   } else if (this.selectedStatus.value === 'Active') {
    //     this.filteredEntities = this.entities.filter((individualEntity) => 
    //     individualEntity.is_active === true && individualEntity.parent_type_name.toLowerCase().includes(this.searchValue));
    //   } else if (this.selectedStatus.value === 'Inactive') {
    //     this.filteredEntities = this.entities.filter((individualEntity) => 
    //     individualEntity.is_active === false && individualEntity.parent_type_name.toLowerCase().includes(this.searchValue));
    //  }
    // }
    // else if (this.selectedOption.value==='parent_value_name'){
    //   if (this.selectedStatus.value === '') {
    //     this.filteredEntities = this.entities.filter((individualEntity)=>
    //     individualEntity.parent_value_name.toLowerCase().includes(this.searchValue));
    //   } else if (this.selectedStatus.value === 'Active') {
    //     this.filteredEntities = this.entities.filter((individualEntity) => 
    //     individualEntity.is_active === true && individualEntity.parent_value_name.toLowerCase().includes(this.searchValue));
    //   } else if (this.selectedStatus.value === 'Inactive') {
    //     this.filteredEntities = this.entities.filter((individualEntity) => 
    //     individualEntity.is_active === false && individualEntity.parent_value_name.toLowerCase().includes(this.searchValue));
    //  }
    // }
    // else if (this.selectedOption.value==='country_name'){
    //   if (this.selectedStatus.value === '') {
    //     this.filteredEntities = this.entities.filter((individualEntity)=>
    //     individualEntity.country_name.toLowerCase().includes(this.searchValue));
    //   } else if (this.selectedStatus.value === 'Active') {
    //     this.filteredEntities = this.entities.filter((individualEntity) => 
    //     individualEntity.is_active === true && individualEntity.country_name.toLowerCase().includes(this.searchValue));
    //   } else if (this.selectedStatus.value === 'Inactive') {
    //     this.filteredEntities = this.entities.filter((individualEntity) => 
    //     individualEntity.is_active === false && individualEntity.country_name.toLowerCase().includes(this.searchValue));
    //  }
    //}
    if(this.selectedOption.value==='name'){
      this.filteredEntities = this.entities.filter((individualEntity)=>
      individualEntity.name.toLowerCase().includes(this.searchValue.toLowerCase()));
    } 
    else if (this.selectedOption.value==='parent_type_name'){
      this.filteredEntities = this.entities.filter((individualEntity)=>
      individualEntity.parent_type_name.toLowerCase().includes(this.searchValue.toLowerCase()));
    }
    else if (this.selectedOption.value==='parent_value_name'){
      this.filteredEntities = this.entities.filter((individualEntity)=>
      individualEntity.parent_value_name.toLowerCase().includes(this.searchValue.toLowerCase()));
    }
    else if (this.selectedOption.value==='country_name'){
      this.filteredEntities = this.entities.filter((individualEntity)=>
      individualEntity.country_name.toLowerCase().includes(this.searchValue.toLowerCase()));
    }
    
  }


  // it is used to clear the data
  clear(table: Table) {
    this.searchValue = '';
    this.selectedStatus = '';
    const retainedSortOrder = table.sortOrder;
    const retainedSortField = 'name';
    table.clear();
    table.sortOrder = retainedSortOrder;
    table.sortField = retainedSortField;
    this.getEntity();
    this.selectedOption=this.options[0].name

  }

  changeStatus(selectedStatus: string) {
    if (selectedStatus === '') {
      this.filteredEntities = this.entities;
    } else if (selectedStatus === 'Active') {
      this.filteredEntities = this.entities.filter((individualEntity) => individualEntity.is_active === true);
    } else if (selectedStatus === 'Inactive') {
      this.filteredEntities = this.entities.filter((individualEntity) => individualEntity.is_active === false);
    }
  }
  // it is used to delete the existing entity
  deleteEntity(individualEntity) {
    this.confirmationService.confirm({
      message: `Are you sure that you want to delete <b>${individualEntity?.name.toUpperCase()}</b>?`,
      header: 'Confirmation',
      accept: () => {
        this.loading = true;
        this.commonService.deleteEntity(individualEntity.id).subscribe((res: any) => {
          if (res && res.status === this.commonUtilityService.SUCCESS) {
            this.commonUtilityService.showSuccessMessage(res.data.message);
            this.loading = false;
            this.getEntity();
            this.searchValue = ''
            this.selectedStatus = this.statuses[0].name
          } else {
            this.commonUtilityService.singleErrorMsg(res.error);
            this.loading = false;
          }
        }, (err: any) => {
          this.loading = false;
          this.commonUtilityService.showErrorMessage(err);
        })
      },
      reject: (type: any) => {
        this.loading = false;
      }
    });
  }
}