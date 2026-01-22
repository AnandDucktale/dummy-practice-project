import logger from '../logger.js';
import ApiError from '../utils/ApiError.js';

import {
  addContactSchema,
  contactDetailSchema,
  contactsSchema,
  editContactSchema,
  searchContactsSchema,
} from '../validations/contact.validation.js';
import {
  contactDetailService,
  contactsService,
  searchContactsService,
  editContactService,
  addContactService,
} from '../services/contactService.js';

export const contacts = async (req, res) => {
  try {
    const { error } = contactsSchema.validate({
      page: req.query.page,
      limit: req.query.limit,
      field: req.query.field,
      contactOwnerId: req.user._id.toString(),
    });

    if (error) {
      throw new ApiError(400, error.details[0].message);
    }
    const response = await contactsService(
      req.query.page,
      req.query.limit,
      req.query.field,
      req.user._id,
    );
    logger.info(response, 'Users all contact');

    return res.status(response.status).json({
      success: true,
      message: 'Users all contact',
      page: response.page,
      limit: response.limit,
      total: response.total,
      totalPages: response.totalPages,
      contacts: response.contacts,
    });
  } catch (error) {
    logger.error(error, 'Error while fetching all contacts');

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const searchContacts = async (req, res) => {
  try {
    const { error } = searchContactsSchema.validate({
      page: req.query.page,
      limit: req.query.limit,
      field: req.query.field,
      search: req.query.search,
      contactOwnerId: req.user._id.toString(),
    });
    if (error) {
      throw new ApiError(400, error.details[0].message);
    }

    const response = await searchContactsService(
      req.query.page,
      req.query.limit,
      req.query.field,
      req.query.search,
      req.user._id,
    );
    logger.info(response, 'Search contacts');

    return res.status(response.status).json({
      success: true,
      message: 'Search contacts',
      page: response.page,
      limit: response.limit,
      total: response.total,
      totalPages: response.totalPages,
      contacts: response.contacts,
    });
  } catch (error) {
    logger.error(error, 'Error while search the contact');

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const contactDetail = async (req, res) => {
  try {
    const { error } = contactDetailSchema.validate({
      contactId: req.query.contactId,
    });

    if (error) {
      throw new ApiError(400, error.details[0].message);
    }

    const response = await contactDetailService(req.query.contactId);
    logger.info(response, 'Single contact detail');

    return res.status(200).json({
      success: true,
      message: 'Single contact detail',
      contact: response.contact,
    });
  } catch (error) {
    logger.error(error, 'Error while getting contact detail');

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const editContact = async (req, res) => {
  try {
    const { error } = editContactSchema.validate({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      contactId: req.body.contactId,
    });
    if (error) {
      throw new ApiError(400, error.details[0].message);
    }

    const response = await editContactService(
      req.body.name,
      req.body.email,
      req.body.phone,
      req.body.contactId,
    );
    logger.info(response, 'Edit contact');

    return res.status(response.status).json({
      success: true,
      message: 'Edit contact',
      contact: response.contact,
    });
  } catch (error) {
    logger.error(error, 'Error while edit the contact');

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const addContact = async (req, res) => {
  try {
    const { error } = addContactSchema.validate({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      contactOwnerId: req.user._id.toString(),
    });

    if (error) {
      throw new ApiError(400, error.details[0].message);
    }

    const response = await addContactService(
      req.body.name,
      req.body.email,
      req.body.phone,
      req.body.age,
      req.user._id,
    );
    logger.info(response, 'Add new contact');

    return res.status(response.status).json({
      success: true,
      message: 'Add new contact',
      contactCreated: response.contactCreated,
    });
  } catch (error) {
    logger.error(error, 'Error while creating new contact');

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
